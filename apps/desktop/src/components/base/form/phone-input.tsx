import React, { useState } from "react";
import { Input } from "./input";
import { cn } from "@/src/utils";

interface PhoneInputProps extends React.ComponentProps<typeof Input> {
  maxLength?: number;
  showCountryCode?: boolean;
  includePlus?: boolean;
  countryCodePlaceholder?: string;
}

export const PhoneInput = ({
  maxLength = 10,
  showCountryCode = false,
  includePlus = true,
  countryCodePlaceholder = "+1",
  onChange,
  ...props
}: PhoneInputProps) => {

  const [value, setValue] = useState((props.value as string) || "");
  const [countryCode, setCountryCode] = useState("");

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "";
    const clean = digits.replace(/\D/g, "").slice(0, maxLength);
    
    if (maxLength === 10) {
      const match = clean.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return clean;
      
      let result = "";
      if (match[1]) result += `(${match[1]}`;
      if (match[1].length === 3) result += ") ";
      if (match[2]) result += `${match[2]}`;
      if (match[2].length === 3) result += "-";
      if (match[3]) result += `${match[3]}`;
      return result.trim();
    }

    return clean;
  };

  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = formatPhoneNumber(e.target.value);
    setValue(val);
    onChange?.(e);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d+]/g, "").slice(0, 5);
    setCountryCode(val);
  };

  return (
    <Input
      {...props}
      type="tel"
      value={value}
      onChange={handleInternalChange}
      prefix={
        showCountryCode && (
          <div className="flex items-center gap-0.5">
            {includePlus && <span className="text-gray-400">+</span>}
            <input
              type="tel"
              value={countryCode}
              onChange={handleCountryCodeChange}
              placeholder={includePlus ? "1" : countryCodePlaceholder}
              className={cn(
                "bg-transparent outline-none text-black dark:text-white font-medium",
                includePlus ? "w-8" : "w-12"
              )}
              maxLength={includePlus ? 4 : 5}
            />
          </div>
        )
      }

    />
  );
};

