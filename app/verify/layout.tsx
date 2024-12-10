import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Steps } from "@/components/verification/steps";
import { Loader2 } from "lucide-react";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Suspense fallback={
          <Card className="p-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </Card>
        }>
          <Steps />
        </Suspense>
        <Suspense fallback={
          <Card className="p-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </Card>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}