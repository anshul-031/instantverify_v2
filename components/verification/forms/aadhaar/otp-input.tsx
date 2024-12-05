import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          An OTP has been sent to your Aadhaar-linked mobile number
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="otp">Aadhaar OTP</Label>
        <Input
          id="otp"
          name="otp"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern="\d{6}"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          title="Please enter a valid 6-digit OTP"
          disabled={disabled}
          required
        />
      </div>
    </div>
  );
}