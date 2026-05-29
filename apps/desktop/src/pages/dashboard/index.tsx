import { useForm } from "react-hook-form";
import { Input, Flex, Btn } from "@/src/components/base";
import { AtSign, Mail } from "lucide-react";

interface FormValues {
  username: string;
  email: string;
}

export const Dashboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted Successfully:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Flex direction="column" items="stretch" className="w-full max-w-md gap-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Username Input Registered with Validation */}
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

        {/* Email Input Registered with Validation */}
        <Input
          label="Email Address"
          placeholder="Enter your email"
          leftIcon={<Mail size={15} strokeWidth={2.5} />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <Btn type="submit" variant="solid" className="mt-2">
          Submit Form
        </Btn>
      </Flex>
    </form>
  );
};
