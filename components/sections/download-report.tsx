"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FileDown } from "lucide-react";

export function DownloadReportSection() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically make an API call to handle the download
    toast({
      title: "Sample Report",
      description: "The sample verification report has been sent to your email.",
    });
    
    setEmail("");
    setPhone("");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <FileDown className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Download Sample Report
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            See how our comprehensive verification reports look like
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="max-w-md mx-auto"
            />
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="max-w-md mx-auto"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
            <Button type="submit" size="lg" className="w-full max-w-md">
              Download Sample Report
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}