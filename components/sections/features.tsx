"use client";

import { Shield, Users, Clock, Globe, CheckCircle, Lock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Secure Verification",
    description: "Advanced security protocols ensure your data is protected throughout the verification process",
    color: "text-blue-500",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Get instant verification results with our automated system",
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Support for ID verification across 195+ countries worldwide",
    color: "text-green-500",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Lock,
    title: "Comprehensive Checks",
    description: "Multi-layer verification including ID, criminal records, and police verification",
    color: "text-purple-500",
    gradient: "from-purple-500 to-purple-600"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              InstantVerify
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides comprehensive verification services with industry-leading features
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="p-6 hover-card-effect h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}