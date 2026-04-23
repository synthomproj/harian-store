import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-xl items-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lupa password</CardTitle>
          <CardDescription>
            Placeholder reset password untuk integrasi auth berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Halaman ini nantinya akan mengirim link reset dari Supabase Auth.
        </CardContent>
      </Card>
    </main>
  );
}
