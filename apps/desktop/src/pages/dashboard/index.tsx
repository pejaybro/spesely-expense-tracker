import { useForm, Controller } from "react-hook-form";
import {
  Input,
  EmailInput,
  PasswordInput,
  AmountInput,
  NumberInput,
  PhoneInput,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  FileInput,
  URLInput,
  TextArea,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  SelectInput,
  MultiSelectInput,
  Switch,
  RangeSlider,
  Flex,
  Button,
  BtnStyles,
  toast,
} from "@/src/components/base";
import { AtSign } from "lucide-react";
import { useMemo, useEffect } from "react";

interface FormValues {
  username: string;
  email: string;
  password: string;
  amount: string;
  age: string;
  phone: string;
  notificationPref: string;
  interests: string[];
  agreeToTerms: boolean;
  website: string;
  documentDropzone: File | null;
  documentField: File | null;
  documentField2: File | null;
  singleDate: Date;
  typeableDate: Date;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  singleTime: Date;
  timeRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  simpleSelect: string;
  multiSelect: string[];
  searchSelect: string;
  agreeToUpdates: boolean;
  budgetLimit: number;
  notes: string;
}

const defaultValues: FormValues = {
  username: "hhhh",
  email: "hello@ghello.com",
  password: "1234567890",
  amount: "1,250.50",
  age: "25",
  phone: "1234567890",
  notificationPref: "email",
  interests: ["technology", "design"],
  agreeToTerms: false,
  website: "https://google.com",
  documentDropzone: null,
  documentField: null,
  documentField2: null,
  singleDate: new Date(),
  typeableDate: new Date(),
  dateRange: {
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
  singleTime: new Date(),
  timeRange: {
    from: new Date(),
    to: new Date(new Date().setHours(new Date().getHours() + 2)),
  },
  simpleSelect: "pizza",
  multiSelect: ["pizza", "pasta"],
  searchSelect: "burger",
  agreeToUpdates: true,
  budgetLimit: 75,
  notes: "Please deliver during business hours.",
};

export const Dashboard = () => {
  /* React Hook Form manages Form state/submission */
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    // Trigger 4 types of toasts with infinite duration
    toast.success({
      title: "Successfully Loaded Dashboard",
      description: "This is a success toast message that stays open.",
      duration: Infinity,
      showClose: true,
    });
    toast.info({
      title: "System Update Available",
      description: "This is an info toast message that stays open.",
      duration: Infinity,
      showClose: true,
    });
    toast.warning({
      title: "Low Budget Warning",
      description: "This is a warning toast message that stays open.",
      duration: Infinity,
      showClose: true,
    });
    toast.error({
      title: "Connection Failed",
      description: "This is an error toast message that stays open.",
      duration: Infinity,
      showClose: true,
    });
    // Trigger 5th custom toast with custom React node content
    toast.custom({
      content: (id) => (
        <div className="p-4 flex flex-col gap-1.5 text-left w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-violet-400">✨ Custom Node Title</span>
            <button
              onClick={() => toast.dismiss(id)}
              className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded cursor-pointer transition-colors font-semibold"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-gray-300">This is a custom React node layout. You can click "Close" to dismiss it.</p>
        </div>
      ),
      duration: Infinity,
    });
  }, []);

  const foodOptions = useMemo(() => [
    { id: "pizza", label: "Pizza", key: "pizza" },
    { id: "burger", label: "Burger", key: "burger" },
    { id: "pasta", label: "Pasta", key: "pasta" },
    { id: "salad", label: "Salad", key: "salad" },
    { id: "sushi", label: "Sushi", key: "sushi" },
  ], []);

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

  /* Logs the full React Hook Form data */
  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted Successfully:", data);
  };

  return (
    <>
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

        {/* URL Input registered with React Hook Form */}
        <URLInput
          label="Website URL"
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register("website", {
            required: "Website URL is required",
          })}
        />

        {/* Text Area (Additional Notes) registered with React Hook Form */}
        <TextArea
          label="Additional Notes"
          description="Enter any custom comments or shipping/billing instructions"
          placeholder="Type your notes here..."
          error={errors.notes?.message}
          autoResize={true}
          showCount="both"
          maxLength={500}
          maxWordLimit={100}
          {...register("notes", {
            maxLength: {
              value: 500,
              message: "Notes cannot exceed 500 characters",
            },
          })}
        />

        {/* Date Picker integrated with React Hook Form Controller */}
        <Controller
          name="singleDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Select Date"
              description="Pick a transaction date"
              error={errors.singleDate?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* Typeable Date Picker integrated with React Hook Form Controller */}
        <Controller
          name="typeableDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Typeable Date Selector"
              description="Type date in dd/mm/yyyy format"
              isTypeable={true}
              typeableFormat="dd/mm/yyyy"
              error={errors.typeableDate?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* Date Range Picker integrated with React Hook Form Controller */}
        <Controller
          name="dateRange"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateRangePicker
              label="Select Date Range"
              description="Choose active start and end dates"
              error={errors.dateRange?.message}
              value={value}
              onChange={onChange}
              presets={[
                "today",
                "yesterday",
                "this-week",
                "last-week",
                "this-month",
                "last-month",
              ]}
            />
          )}
        />

        {/* Time Picker integrated with React Hook Form Controller */}
        <Controller
          name="singleTime"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TimePicker
              label="Select Time"
              description="Choose a transaction time"
              error={errors.singleTime?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* Time Range Picker integrated with React Hook Form Controller */}
        <Controller
          name="timeRange"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TimeRangePicker
              label="Select Time Range"
              description="Choose active start and end times"
              error={errors.timeRange?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* Simple Select Dropdown Input example */}
        <Controller
          name="simpleSelect"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black">Simple Dropdown</span>
                <span className="text-[11px] text-black font-medium mt-0.5">Select a single option from list</span>
              </div>
              <SelectInput
                options={foodOptions}
                value={value}
                onChange={onChange}
                placeholder="Choose food..."
                error={!!errors.simpleSelect}
              />
            </div>
          )}
        />

        {/* Searchable Select Dropdown Input example */}
        <Controller
          name="searchSelect"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black">Searchable Dropdown</span>
                <span className="text-[11px] text-black font-medium mt-0.5">Search and pick an option</span>
              </div>
              <SelectInput
                options={foodOptions}
                value={value}
                onChange={onChange}
                searchable={true}
                searchPosition="dropdown"
                placeholder="Search food..."
                error={!!errors.searchSelect}
              />
            </div>
          )}
        />

        {/* Multi-Select Dropdown Input example */}
        <Controller
          name="multiSelect"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black">Multi-Select Dropdown</span>
                <span className="text-[11px] text-black font-medium mt-0.5">Select multiple tags from list</span>
              </div>
              <MultiSelectInput
                options={foodOptions}
                value={value}
                onChange={onChange}
                displayMode="chips"
                showTooltip={true}
                placeholder="Select foods..."
                error={!!errors.multiSelect}
              />
            </div>
          )}
        />

        {/* 1. File Input Dropzone Variant */}
        <Controller
          name="documentDropzone"
          control={control}
          render={({ field: { onChange } }) => (
            <FileInput
              label="Dropzone File Input (Variant 1 - Dropzone)"
              variant="dropzone"
              dropzoneVariant="rectangle"
              maxFileSize={5}
              accept=".pdf,.png,.jpg,.jpeg"
              error={errors.documentDropzone?.message}
              onChange={(e) => {
                const files = e.target.files;
                onChange(files && files.length > 0 ? files[0] : null);
              }}
            />
          )}
        />

        {/* 2. File Input Field Variant */}
        <Controller
          name="documentField"
          control={control}
          render={({ field: { onChange } }) => (
            <FileInput
              label="Field File Input (Variant 2 - Input Field)"
              variant="field"
              maxFileSize={5}
              accept=".pdf,.png,.jpg,.jpeg"
              error={errors.documentField?.message}
              onChange={(e) => {
                const files = e.target.files;
                onChange(files && files.length > 0 ? files[0] : null);
              }}
            />
          )}
        />

        {/* 3. File Input Field-2 Variant */}
        <Controller
          name="documentField2"
          control={control}
          render={({ field: { onChange } }) => (
            <FileInput
              label="Field-2 File Input (Variant 3 - Double Action)"
              variant="field-2"
              maxFileSize={5}
              accept=".pdf,.png,.jpg,.jpeg"
              error={errors.documentField2?.message}
              onChange={(e) => {
                const files = e.target.files;
                onChange(files && files.length > 0 ? files[0] : null);
              }}
            />
          )}
        />

        {/* Radio Group of 2 options (notification preferences) */}
        <Controller
          name="notificationPref"
          control={control}
          rules={{ required: "Please select a notification preference" }}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              label="Notification Preference"
              description="Choose how you want to receive alerts"
              error={errors.notificationPref?.message}
              value={value}
              onChange={onChange}
              options={[
                { label: "Email Notifications", value: "email", description: "Receive reports and alerts via email" },
                { label: "SMS Alerts", value: "sms", description: "Receive instant updates on your mobile device" },
              ]}
            />
          )}
        />

        {/* Checkbox Group of 5 options (interests) */}
        <Controller
          name="interests"
          control={control}
          rules={{
            validate: val => !val || val.length >= 1 || "Please select at least one interest",
          }}
          render={({ field: { value, onChange } }) => (
            <CheckboxGroup
              label="Interests"
              description="Select your favorite categories (select at least one)"
              error={errors.interests?.message}
              value={value}
              onChange={onChange}
              options={[
                { label: "Technology", value: "technology", description: "Gadgets, software, development" },
                { label: "Design", value: "design", description: "UI/UX, graphic design, art" },
                { label: "Marketing", value: "marketing", description: "SEO, campaigns, analytics" },
                { label: "Finance", value: "finance", description: "Investing, budgeting, economy" },
                { label: "Sports", value: "sports", description: "Athletics, fitness, games" },
              ]}
            />
          )}
        />

        {/* Single Check/Uncheck Box (Terms and Conditions agreement) */}
        <Controller
          name="agreeToTerms"
          control={control}
          rules={{ required: "You must agree to the terms to continue" }}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              label="I agree to the Terms and Conditions"
              description="By checking this, you agree to our privacy policy and service terms"
              error={errors.agreeToTerms?.message}
              checked={value}
              onChange={onChange}
            />
          )}
        />

        {/* Switch toggles (agree to marketing/updates) */}
        <Controller
          name="agreeToUpdates"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch
              label="Subscribe to product updates"
              description="Receive weekly summaries of new features and improvements"
              checked={value}
              onChange={onChange}
            />
          )}
        />

        {/* Range Slider for monthly budget limit setting */}
        <Controller
          name="budgetLimit"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RangeSlider
              label="Monthly Expense Budget Limit"
              description="Set your maximum monthly spending threshold"
              min={10}
              max={500}
              step={5}
              valueSuffix=" USD"
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* Disabled unless all RHF validations pass */}
        <Button type="submit" variant="primary" className="mt-2" disabled={!isValid}>
          Submit Form
        </Button>
      </Flex>
    </form>

    {/* Toast Showcase */}
    <Flex direction="column" className="w-full max-w-md gap-4 mt-8 p-4 bg-dark-c1 border border-chalk-10 rounded-lg">
      <h2 className="text-lg font-bold">Toast Notification Showcase</h2>
      <p className="text-xs text-gray-400">Click the buttons below to trigger infinite duration toasts of each type.</p>
      <Flex direction="row" className="gap-2 flex-wrap">
        <Button
          variant="success"
          onClick={() =>
            toast.success({
              title: "Success Toast",
              description: "This success toast stays open until dismissed.",
              duration: Infinity,
              showClose: true,
            })
          }
        >
          Success
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            toast.info({
              title: "Info Toast",
              description: "This info toast stays open until dismissed.",
              duration: Infinity,
              showClose: true,
            })
          }
        >
          Info
        </Button>
        <Button
          variant="warning"
          onClick={() =>
            toast.warning({
              title: "Warning Toast",
              description: "This warning toast stays open until dismissed.",
              duration: Infinity,
              showClose: true,
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            toast.error({
              title: "Error Toast",
              description: "This error toast stays open until dismissed.",
              duration: Infinity,
              showClose: true,
            })
          }
        >
          Error
        </Button>
        <Button
          variant="black"
          onClick={() =>
            toast.custom({
              content: (id) => (
                <div className="p-4 flex flex-col gap-2 text-left w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-violet-400">✨ Custom Node Toast</span>
                  </div>
                  <p className="text-[11px] text-gray-300">You can click the button below to dismiss this toast dynamically!</p>
                  <Flex direction="row" className="gap-2">
                    <Button
                      variant="primary-soft"
                      rounded="sm"
                      onClick={() => alert("Action inside custom toast!")}
                    >
                      Action
                    </Button>
                    <Button
                      variant="danger-soft"
                      rounded="sm"
                      onClick={() => toast.dismiss(id)}
                    >
                      Dismiss Toast
                    </Button>
                  </Flex>
                </div>
              ),
              duration: Infinity,
            })
          }
        >
          Custom
        </Button>
      </Flex>
    </Flex>

    {/* ── Button variant showcase ─────────────── */}
    <BtnStyles />
    </>
  );
};
