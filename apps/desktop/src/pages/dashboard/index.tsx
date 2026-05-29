import { useForm } from "react-hook-form";
import {
  Input,
  EmailInput,
  PasswordInput,
  Flex,
  Btn,
} from "@/src/components/base";
import { AtSign } from "lucide-react";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

const defaultValues: FormValues = {
  username: "hhhh",
  email: "hello@ghello.com",
  password: "1234567890",
};

export const Dashboard = () => {
  // React Hook Form manages Username, Email, and Password state/submission
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
              noWhitespace: (val) => !val || !/\s/.test(val) || "Password cannot contain spaces",
            },
          })}
        />

        {/* Disabled unless all RHF validations pass */}
        <Btn
          type="submit"
          variant="solid"
          className="mt-2"
          disabled={!isValid}
        >
          Submit Form
        </Btn>
      </Flex>
    </form>
  );
};

