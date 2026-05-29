import { useForm } from "react-hook-form";
import {
  Input,
  EmailInput,
  PasswordInput,
  AmountInput,
  NumberInput,
  PhoneInput,
  Flex,
  Btn,
} from "@/src/components/base";
import { AtSign } from "lucide-react";

interface FormValues {
  username: string;
  email: string;
  password: string;
  amount: string;
  age: string;
  phone: string;
}

const defaultValues: FormValues = {
  username: "hhhh",
  email: "hello@ghello.com",
  password: "1234567890",
  amount: "1,250.50",
  age: "25",
  phone: "1234567890",
};

export const Dashboard = () => {
  // React Hook Form manages Form state/submission
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues,
  });

  const emailValue = watch("email");
  const passwordValue = watch("password") || "";
  const amountValue = watch("amount") || "";
  const ageValue = watch("age") || "";
  const phoneValue = watch("phone") || "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(emailValue);

  const emailRegister = register("email", {
    required: "Email is required",
    pattern: {
      value: emailRegex,
      message: "Please enter a valid email address",
    },
  });

  // Logs the full React Hook Form data
  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted Successfully:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Flex
        direction="column"
        items="stretch"
        className="w-full max-w-md gap-6"
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Username Input registered with React Hook Form */}
        <Input
          label="Username"
          placeholder="Enter your username"
          leftIcon={<AtSign size={15} strokeWidth={2.5} />}
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
        />

        {/* Specialized Email Input (Driven by React Hook Form) */}
        <EmailInput
          label="Email Address"
          placeholder="Enter your email"
          value={emailValue}
          isValid={isEmailValid}
          error={errors.email?.message}
          {...emailRegister}
        />

        {/* Password Input registered with React Hook Form */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          showStrengthMeter={true}
          showRequirements={true}
          showCapsLockWarning={true}
          showWhitespaceWarning={true}
          error={errors.password?.message}
          value={passwordValue}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: {
              noWhitespace: val =>
                !val || !/\s/.test(val) || "Password cannot contain spaces",
            },
          })}
        />

        {/* Amount Input registered with React Hook Form */}
        <AmountInput
          label="Transaction Amount"
          placeholder="0.00"
          value={amountValue}
          fixedDecimalOnBlur={true}
          showSteppers={true}
          error={errors.amount?.message}
          {...register("amount", {
            required: "Amount is required",
          })}
        />

        {/* Number Input (e.g. Age) registered with React Hook Form */}
        <NumberInput
          label="Age"
          placeholder="0"
          value={ageValue}
          min={0}
          max={120}
          error={errors.age?.message}
          {...register("age", {
            required: "Age is required",
          })}
        />

        {/* Phone Input registered with React Hook Form */}
        <PhoneInput
          label="Phone Number"
          placeholder="(555) 555-5555"
          value={phoneValue}       
          error={errors.phone?.message}
          {...register("phone", {
            required: "Phone number is required",
          })}
        />

        {/* Disabled unless all RHF validations pass */}
        <Btn type="submit" variant="solid" className="mt-2" disabled={!isValid}>
          Submit Form
        </Btn>
      </Flex>
    </form>
  );
};
