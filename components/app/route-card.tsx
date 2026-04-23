import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RouteCardProps = {
  title: string;
  description: string;
  href: string;
};

export function RouteCard({ title, description, href }: RouteCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-colors group-hover:border-slate-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>{title}</span>
            <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">Buka halaman</CardContent>
      </Card>
    </Link>
  );
}
