import crypto from "node:crypto";
import { getPaydiaEnv } from "@/lib/env";

const ACCESS_TOKEN_PATH = "/snap/v1.0/access-token/b2b";
const GENERATE_QR_PATH = "/snap/v1.0/qr/qr-mpm-generate";
const STATUS_INQUIRY_PATH = "/snap/v2.0/qr/qr-mpm-status";

type PaydiaAccessTokenResponse = {
  accessToken: string;
  expiresIn: string;
  tokenType: string;
  responseCode: string;
  responseMessage: string;
};

type PaydiaGenerateQrResponse = {
  responseCode: string;
  responseMessage: string;
  referenceNo?: string;
  partnerReferenceNo?: string;
  qrContent?: string;
  merchantName?: string;
  storeId?: string;
  terminalId?: string;
};

type PaydiaStatusInquiryResponse = {
  responseCode: string;
  responseMessage: string;
  originalPartnerReferenceNo?: string;
  originalReferenceNo?: string;
  latestTransactionStatus?: string;
  transactionStatusDesc?: string;
  transactionDate?: string;
  amount?: {
    value?: string;
    currency?: string;
  };
  additionalInfo?: {
    paidTime?: string;
    callback?: string;
    responseCallback?: string;
    [key: string]: unknown;
  };
};

type PaydiaNotifyPayload = {
  originalPartnerReferenceNo?: string;
  originalReferenceNo?: string;
  latestTransactionStatus?: string;
  transactionStatusDesc?: string;
  createdTime?: string;
  finishedTime?: string;
  amount?: {
    value?: string;
    currency?: string;
  };
  additionalInfo?: Record<string, unknown>;
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function getJakartaTimestamp(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+07:00`;
}

function formatMoney(amount: number) {
  return amount.toFixed(2);
}

function getMinifiedBody(body: unknown) {
  return JSON.stringify(body);
}

function hashBody(body: unknown) {
  return crypto.createHash("sha256").update(getMinifiedBody(body)).digest("hex").toLowerCase();
}

export function hashRawBody(body: string) {
  return crypto.createHash("sha256").update(body).digest("hex").toLowerCase();
}

function generateAsymmetricSignature(clientId: string, timestamp: string, privateKey: string) {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${clientId}|${timestamp}`);
  signer.end();
  return signer.sign(privateKey, "base64");
}

function generateSymmetricSignature(method: string, path: string, token: string, body: unknown, timestamp: string, clientSecret: string) {
  const stringToSign = `${method}:${path}:${token}:${hashBody(body)}:${timestamp}`;
  return crypto.createHmac("sha512", clientSecret).update(stringToSign).digest("base64");
}

function getNumericExternalId() {
  const unix = Date.now().toString();
  const suffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${unix}${suffix}`.slice(0, 18);
}

function getValidityPeriod(minutes = 30) {
  return getJakartaTimestamp(new Date(Date.now() + minutes * 60 * 1000));
}

export function mapPaydiaSnapStatus(statusCode: string | null) {
  switch (statusCode) {
    case "00":
      return { paymentStatus: "approved", orderStatus: "paid" };
    case "05":
      return { paymentStatus: "rejected", orderStatus: "rejected" };
    case "01":
    case "02":
    default:
      return { paymentStatus: "pending", orderStatus: "pending_payment" };
  }
}

export function verifyPaydiaWebhookSignature(signature: string, timestamp: string, rawBody: string) {
  const { publicKey } = getPaydiaEnv();
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`POST:/api/webhooks/paydia/qris:${hashRawBody(rawBody)}:${timestamp}`);
  verifier.end();

  return verifier.verify(publicKey, signature, "base64");
}

export function parsePaydiaNotifyPayload(payload: PaydiaNotifyPayload) {
  const latestTransactionStatus = payload.latestTransactionStatus ?? null;
  const mappedStatus = mapPaydiaSnapStatus(latestTransactionStatus);

  return {
    partnerReferenceNo: payload.originalPartnerReferenceNo ?? null,
    referenceNo: payload.originalReferenceNo ?? null,
    latestTransactionStatus,
    transactionStatusDesc: payload.transactionStatusDesc ?? null,
    paidAt: latestTransactionStatus === "00" ? payload.finishedTime ?? null : null,
    paymentStatus: mappedStatus.paymentStatus,
    orderStatus: mappedStatus.orderStatus,
  };
}

export async function getPaydiaAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 30_000) {
    return cachedAccessToken.token;
  }

  const { baseUrl, clientId, clientPrivateKey } = getPaydiaEnv();
  const timestamp = getJakartaTimestamp();
  const body = { grantType: "client_credentials" };
  const signature = generateAsymmetricSignature(clientId, timestamp, clientPrivateKey);

  const response = await fetch(`${baseUrl}${ACCESS_TOKEN_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-TIMESTAMP": timestamp,
      "X-CLIENT-KEY": clientId,
      "X-SIGNATURE": signature,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseBody = (await response.json().catch(() => null)) as PaydiaAccessTokenResponse | null;

  if (!response.ok || !responseBody?.accessToken) {
    throw new Error(responseBody?.responseMessage ?? "Gagal mengambil access token Paydia.");
  }

  const expiresInSeconds = Number(responseBody.expiresIn || 0);
  cachedAccessToken = {
    token: responseBody.accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };

  return responseBody.accessToken;
}

export async function generatePaydiaQris(order: { orderCode: string; totalAmount: number }) {
  const accessToken = await getPaydiaAccessToken();
  const { baseUrl, callbackUrl, channelId, clientId, clientSecret, merchantId, storeId, terminalId } = getPaydiaEnv();
  const timestamp = getJakartaTimestamp();
  const externalId = getNumericExternalId();
  const body = {
    merchantId,
    ...(storeId ? { storeId } : {}),
    ...(terminalId ? { terminalId } : {}),
    partnerReferenceNo: order.orderCode,
    amount: {
      value: formatMoney(order.totalAmount),
      currency: "IDR",
    },
    validityPeriod: getValidityPeriod(),
    additionalInfo: {
      callback: callbackUrl,
    },
  };
  const signature = generateSymmetricSignature("POST", GENERATE_QR_PATH, accessToken, body, timestamp, clientSecret);

  const response = await fetch(`${baseUrl}${GENERATE_QR_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-TIMESTAMP": timestamp,
      "X-PARTNER-ID": clientId,
      "X-EXTERNAL-ID": externalId,
      "CHANNEL-ID": channelId,
      "X-SIGNATURE": signature,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseBody = (await response.json().catch(() => null)) as PaydiaGenerateQrResponse | null;

  if (!response.ok || !responseBody?.qrContent) {
    throw new Error(responseBody?.responseMessage ?? "Gagal membuat QRIS Paydia.");
  }

  return {
    externalId,
    validityPeriod: body.validityPeriod,
    responseBody,
  };
}

export async function inquirePaydiaQrisStatus(input: {
  partnerReferenceNo: string | null;
  referenceNo: string | null;
}) {
  const accessToken = await getPaydiaAccessToken();
  const { baseUrl, channelId, clientId, clientSecret } = getPaydiaEnv();
  const timestamp = getJakartaTimestamp();
  const externalId = getNumericExternalId();
  const body = {
    ...(input.partnerReferenceNo ? { originalPartnerReferenceNo: input.partnerReferenceNo } : {}),
    ...(input.referenceNo ? { originalReferenceNo: input.referenceNo } : {}),
    serviceCode: "47",
  };

  if (!input.partnerReferenceNo && !input.referenceNo) {
    throw new Error("Reference transaksi Paydia belum tersedia.");
  }

  const signature = generateSymmetricSignature("POST", STATUS_INQUIRY_PATH, accessToken, body, timestamp, clientSecret);

  const response = await fetch(`${baseUrl}${STATUS_INQUIRY_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-TIMESTAMP": timestamp,
      "X-PARTNER-ID": clientId,
      "X-EXTERNAL-ID": externalId,
      "CHANNEL-ID": channelId,
      "X-SIGNATURE": signature,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseBody = (await response.json().catch(() => null)) as PaydiaStatusInquiryResponse | null;

  if (!response.ok || !responseBody?.responseCode) {
    throw new Error(responseBody?.responseMessage ?? "Gagal mengambil status QRIS Paydia.");
  }

  return responseBody;
}
