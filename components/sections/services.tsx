import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Home, Car, Users } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Home,
    title: "Tenant Verification",
    description: "Comprehensive background checks for potential tenants",
    link: "/#tenant"
  },
  {
    icon: UserCheck,
    title: "Domestic Help Verification",
    description: "Thorough verification for household staff",
    link: "/#domestic"
  },
  {
    icon: Car,
    title: "Driver Verification",
    description: "Complete background checks for drivers",
    link: "/#driver"
  },
  {
    icon: Users,
    title: "Visitor Verification",
    description: "Quick and reliable visitor background checks",
    link: "/#visitor"
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive verification solutions for various needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col items-center text-center">
                <service.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href={service.link}>
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}