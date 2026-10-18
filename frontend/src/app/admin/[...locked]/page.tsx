import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function LockedModule() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="max-w-md w-full border-none shadow-xl bg-white text-center p-12 rounded-3xl">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-evhs-dark mb-2">Module Locked</h2>
        <p className="text-muted-foreground mb-8">
          This feature is currently in progress and will be available in a future update.
        </p>
        <div className="text-xs uppercase tracking-widest font-bold text-gold">
          Coming Soon
        </div>
      </Card>
    </div>
  );
}
