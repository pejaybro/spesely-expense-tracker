import React from "react";
import { Input } from "./input";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

/*
 * ============================================================================
 * Types & Interfaces
 * ============================================================================
 */

interface EmailInputProps extends React.ComponentProps<typeof Input> {
  /* Controls visibility of validation indicator icons (Check/Alert) */
  showValidationIcon?: boolean;
  /* Represents the validity status calculated by the parent form state */
  isValid?: boolean;
}

/*
 * ============================================================================
 * Style Theme Configuration
 * ============================================================================
 */

const EMAIL_STYLE = {
  /* Status icon styling */
  successIcon: "text-green-500",
  warningIcon: "text-amber-500",

  /* Sizing parameter */
  iconSize: 18,
};

/*
 * ============================================================================
 * EmailInput Component
 * ============================================================================
 */

export const EmailInput = ({
  showValidationIcon = true,
  isValid = false,
  onChange,
  className,
  value,
  ...props
}: EmailInputProps) => {
  return (
    <Input
      autoComplete="email"
      type="email"
      leftIcon={<Mail size={EMAIL_STYLE.iconSize} />}
      {...props}
      value={value}
      onChange={onChange}
      rightIcon={
        /* Render check circle on success, alert circle on format errors */
        showValidationIcon && value ? (
          isValid ? (
            <CheckCircle2 size={EMAIL_STYLE.iconSize} className={EMAIL_STYLE.successIcon} />
          ) : (
            <AlertCircle size={EMAIL_STYLE.iconSize} className={EMAIL_STYLE.warningIcon} />
          )
        ) : (
          props.rightIcon
        )
      }
      className={className}
    />
  );
};
