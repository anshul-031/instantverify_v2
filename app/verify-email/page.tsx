"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          // Redirect to login after 3 seconds on success
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error);
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to login page in a few seconds...
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-4">
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Sign Up Again
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}