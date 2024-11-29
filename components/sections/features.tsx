import { Shield, Users, Clock, Globe, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Secure Verification",
    description: "Advanced security protocols ensure your data is protected throughout the verification process"
  },
  {
    icon: Clock,
    title: "Real-time Results",
    description: "Get instant verification results with our automated system"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Support for ID verification across 195+ countries worldwide"
  },
  {
    icon: CheckCircle,
    title: "Comprehensive Checks",
    description: "Multi-layer verification including ID, criminal records, and police verification"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose InstantVerify
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides comprehensive verification services with industry-leading features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}