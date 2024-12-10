"use client";

import * as React from "react";
import { DotFilledIcon } from "@radix-ui/react-icons";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DotFilledIcon />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTPSeparator };