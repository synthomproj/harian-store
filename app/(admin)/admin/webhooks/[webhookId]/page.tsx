import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminWebhookDetailPageProps = {
  params: Promise<{ webhookId: string }>;
};

export default async function AdminWebhookDetailPage({ params }: AdminWebhookDetailPageProps) {
  const { webhookId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook {webhookId}</CardTitle>
        <CardDescription>Payload, response, dan error log provisioning.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Detail ini nantinya dipakai untuk audit dan troubleshooting workflow `n8n`.
      </CardContent>
    </Card>
  );
}
