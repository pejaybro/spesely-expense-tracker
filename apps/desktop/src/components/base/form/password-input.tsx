import React, { useState } from "react";
import { Input } from "./input";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/utils";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  showToggle?: boolean;
  showCapsLockWarning?: boolean;
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
  showWhitespaceWarning?: boolean;
}

export const PasswordInput = ({
  showToggle = true,
  showCapsLockWarning = false,
  showStrengthMeter = false,
  showRequirements = false,
  showWhitespaceWarning = false,
  ...props
}: PasswordInputProps) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [strength, setStrength] = useState(0);
  const [value, setValue] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const calculateStrength = (val: string) => {
    let score = 0;
    if (!val) return 0;
    if (val.length > 6) score++;
    if (val.length > 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent | React.FocusEvent) => {
    if (!showCapsLockWarning) return;
    if ("getModifierState" in e) {
      setIsCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-amber-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const requirements = [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "At least one number", met: /[0-9]/.test(value) },
    { label: "One uppercase letter", met: /[A-Z]/.test(value) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(value) },
  ];

  return (
    <div className="flex flex-col w-full gap-1">
      <Input
        autoComplete="current-password"
        {...props}
        type={isVisible ? "text" : "password"}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          setStrength(calculateStrength(val));
          props.onChange?.(e);
        }}
        onKeyUp={(e) => {
          checkCapsLock(e);
          props.onKeyUp?.(e);
        }}
        onFocus={(e) => {
          checkCapsLock(e);
          props.onFocus?.(e);
        }}
        onClick={(e) => {
          checkCapsLock(e);
          props.onClick?.(e);
        }}
        rightIcon={
          showToggle ? (
            isVisible ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )
          ) : (
            props.rightIcon
          )
        }
        onRightIconClick={showToggle ? toggleVisibility : props.onRightIconClick}
      />

      {showStrengthMeter && value !== "" && (
        <div className="flex flex-col gap-1 px-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 flex-1 h-1 mt-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-full flex-1 rounded-full transition-all duration-500",
                    strength >= step
                      ? getStrengthColor()
                      : "bg-gray-200 dark:bg-gray-800"
                  )}
                />
              ))}
            </div>
            <span
              className={cn(
                "text-[10px] font-bold ml-2 uppercase",
                strength > 0 ? "opacity-100" : "opacity-0"
              )}
            >
              {getStrengthLabel()}
            </span>
          </div>
        </div>
      )}

      {showRequirements && value !== "" && (
        <div className="flex flex-col gap-1.5 mt-2 px-1">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-300",
                  req.met
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 dark:border-gray-700"
                )}
              >
                {req.met && <Check size={10} className="text-white" />}
              </div>
              <span
                className={cn(
                  "text-[11px] transition-colors duration-300",
                  req.met
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : "text-gray-500"
                )}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {showCapsLockWarning && isCapsLockOn && (
        <span className="text-[10px] font-bold text-amber-600 ml-1 uppercase tracking-wider">
          ⚠️ Caps Lock is ON
        </span>
      )}

      {showWhitespaceWarning && /\s/.test(value) && (
        <span className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">
          ⚠️ Password contains spaces
        </span>
      )}
    </div>
  );
};





