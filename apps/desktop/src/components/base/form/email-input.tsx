import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/src/utils";

interface EmailInputProps extends React.ComponentProps<typeof Input> {
  showValidationIcon?: boolean;
}

/**
 * Validates standard email formats:
 * - user@domain.com
 * - first.last@subdomain.example.org
 * - name+tag@provider.net
 */
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const EmailInput = ({
  showValidationIcon = true,
  onChange,
  className,
  ...props
}: EmailInputProps) => {
  const [value, setValue] = useState((props.value as string) || "");
  const [isValid, setIsValid] = useState(validateEmail((props.value as string) || ""));

  useEffect(() => {
    const newVal = (props.value as string) || "";
    setValue(newVal);
    setIsValid(validateEmail(newVal));
  }, [props.value]);

  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const val = e.target.value.toLowerCase();
    setValue(val);
    setIsValid(validateEmail(val));
    
    // Create a fake event with the lowercased value
    const event = {
      ...e,
      target: { ...e.target, value: val }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(event);
  };


  return (
    <Input
      autoComplete="email"
      type="email"
      leftIcon={<Mail size={18} />}
      {...props}
      value={value}
      onChange={handleInternalChange}
      rightIcon={
        showValidationIcon && value ? (
          isValid ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <AlertCircle size={18} className="text-amber-500" />
          )
        ) : (
          props.rightIcon
        )
      }
      className={cn(
        value && !isValid && "focus-within:border-amber-500 focus-within:ring-amber-500/20",
        className
      )}
    />
  );
};
