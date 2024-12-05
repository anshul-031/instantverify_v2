import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AadhaarInput({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
      <Input
        id="aadhaarNumber"
        name="aadhaarNumber"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        pattern="\d{12}"
        maxLength={12}
        placeholder="Enter 12-digit Aadhaar number"
        title="Please enter a valid 12-digit Aadhaar number"
        disabled={disabled}
        required
      />
    </div>
  );
}