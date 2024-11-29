import { Card } from "@/components/ui/card";
import { FileCheck, Shield, UserCheck, FileText } from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    title: "Upload Documents",
    description: "Upload proof of address, such as Aadhaar card, and take a photo"
  },
  {
    icon: Shield,
    title: "OTP Verification",
    description: "Verify your identity with OTP received on your phone"
  },
  {
    icon: UserCheck,
    title: "Automated Verification",
    description: "Our system verifies your Aadhaar from UIDAI and checks criminal records"
  },
  {
    icon: FileText,
    title: "Final Report",
    description: "Receive the final police verification report"
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to get your verification report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 relative">
              <div className="flex flex-col items-center text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <step.icon className="h-12 w-12 text-primary mb-4 mt-4" />
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}