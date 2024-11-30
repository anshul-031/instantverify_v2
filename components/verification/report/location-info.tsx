"use client";

import { Card } from "@/components/ui/card";
import { LocationInfo } from "@/lib/types/report";
import { MapPin } from "lucide-react";

interface Props {
  info: LocationInfo;
}

export function LocationInfoSection({ info }: Props) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Location Information</h2>
      </div>

      <div className="space-y-4">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${info.latitude},${info.longitude}`}
            allowFullScreen
          />
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Address</dt>
            <dd className="font-medium">{info.address}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Timestamp</dt>
            <dd className="font-medium">{new Date(info.timestamp).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Latitude</dt>
            <dd className="font-medium">{info.latitude}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Longitude</dt>
            <dd className="font-medium">{info.longitude}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}