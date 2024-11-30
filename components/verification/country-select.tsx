"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe2, AlertTriangle } from "lucide-react";
import { countries } from "@/lib/data/countries";

interface Props {
  value?: string;
  onChange: (country: string) => void;
}

export function CountrySelect({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Globe2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Select Country</h2>
      </div>
      
      <p className="text-gray-600">
        Choose the country where the government ID was issued
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-4 pt-4"
      >
        {countries.map((country) => (
          <Label
            key={country.code}
            className="cursor-pointer"
            htmlFor={country.code}
          >
            <Card className={`p-4 hover:border-primary transition-colors ${
              value === country.code ? "border-primary" : ""
            }`}>
              <div className="flex items-start space-x-4">
                <RadioGroupItem 
                  value={country.code} 
                  id={country.code} 
                  className="mt-1"
                  disabled={!country.isSupported}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{country.name}</h3>
                  <div className="mt-1 text-sm">
                    {country.isSupported ? (
                      <div className="text-gray-600">
                        Supported IDs: {country.supportedIds.join(", ")}
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {value && value !== "IN" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Currently, only Indian IDs are fully supported. Support for other countries will be added soon.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}