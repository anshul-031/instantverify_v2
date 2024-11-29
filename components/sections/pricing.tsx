"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    title: "B2C",
    description: "For individual verifications",
    originalPrice: "₹100",
    discountedPrice: "₹20",
    features: [
      "Real-time ID verification",
      "Criminal background screening",
      "Police verification report",
      "24/7 support",
    ],
    note: "* Prices are subject to GST",
    cta: "Get Started",
    popular: true,
  },
  {
    title: "B2B",
    description: "For businesses and organizations",
    price: "Custom Pricing",
    features: [
      "Bulk verification options",
      "API integration",
      "Dedicated account manager",
      "Custom reporting",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
  {
    title: "B2G",
    description: "For government organizations",
    price: "Custom Pricing",
    features: [
      "Specialized compliance features",
      "Bulk processing",
      "Custom integration",
      "Dedicated support team",
      "Enhanced security features",
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                {plan.originalPrice ? (
                  <div className="mb-4">
                    <span className="text-gray-400 line-through text-lg">{plan.originalPrice}</span>
                    <span className="text-3xl font-bold text-primary ml-2">{plan.discountedPrice}</span>
                    <span className="text-sm text-gray-600 block">{plan.note}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold mb-4">{plan.price}</div>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.title === "B2C" ? "/signup" : "/contact"} className="block">
                <Button className="w-full">{plan.cta}</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}