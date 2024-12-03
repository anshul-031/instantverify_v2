"use client";

import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/verification";
import { CreditCard } from "lucide-react";

interface Props {
  orderId: string;
  amount: number;
  currency: string;
}

export function PaymentStatus({ orderId, amount, currency }: Props) {
  return (
    <Card className="p-4 bg-gray-50">
      <div className="flex items-center space-x-4">
        <CreditCard className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-gray-600">Order ID: {orderId}</p>
          <p className="font-medium">
            Amount: {formatPrice(amount)}
          </p>
        </div>
      </div>
    </Card>
  );
}