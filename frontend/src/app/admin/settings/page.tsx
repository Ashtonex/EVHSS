import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key } from "lucide-react";
import { AUTH_COOKIE_NAME, getCurrentUser } from "@/lib/api";

export const revalidate = 0;

export default async function SettingsPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  let userEmail = "Unknown";
  try {
    const user = await getCurrentUser(token);
    userEmail = user.email;
  } catch (error) {
    console.error("Error fetching current user:", error);
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark">Settings & IAM</h1>
          <p className="text-muted-foreground mt-1">Configure system settings, users permissions, roles, and security credentials.</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="p-6 border-b border-border/50">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Shield className="w-5 h-5 text-evhs" />
              Role-Based Access Control (RBAC)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm border-b pb-3 border-zinc-100">
              <div>
                <p className="font-bold text-zinc-800">Administrator</p>
                <p className="text-xs text-muted-foreground">Full system configuration permissions</p>
              </div>
              <Badge className="bg-evhs text-white rounded-full">Owner</Badge>
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-3 border-zinc-100">
              <div>
                <p className="font-bold text-zinc-800">Veterinarian</p>
                <p className="text-xs text-muted-foreground">Clinical medical records access only</p>
              </div>
              <Badge variant="outline" className="border-zinc-300 text-zinc-700">Write</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-zinc-800">Groomer Stylist</p>
                <p className="text-xs text-muted-foreground">Grooming records write permission</p>
              </div>
              <Badge variant="outline" className="border-zinc-300 text-zinc-700">Write</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="p-6 border-b border-border/50">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Key className="w-5 h-5 text-gold" />
              IAM Credentials & Session
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-sm space-y-2">
              <p className="text-muted-foreground font-medium">Logged in user email:</p>
              <p className="font-mono text-zinc-800 font-bold">{userEmail}</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-sm space-y-2">
              <p className="text-muted-foreground font-medium">Authentication Token Type:</p>
              <p className="font-mono text-zinc-800 font-bold">FastAPI Bearer JWT</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
