import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  TextArea,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  RangeSlider,
  DatePicker,
  TimePicker,
  DateRangePicker,
  TimeRangePicker,
  NumberInput,
  AmountInput,
  PhoneInput,
  URLInput,
  EmailInput,
  FileInput,
  SelectInput,
  MultiSelectInput,
  Button,
  Flex,
} from "@/src/components/base";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  amount: string;
  quantity: number;
  bio: string;
  category: string;
  tags: string[];
  agreeTerms: boolean;
  notifications: boolean;
  gender: string;
  budgetLimit: number;
  eventDate: Date | null;
  eventTime: Date | null;
  dateRange: { from: Date | undefined; to: Date | undefined } | null;
  timeRange: { from: Date | undefined; to: Date | undefined } | null;
  profilePic: File | null;
}

export const DailyExpense = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      website: "",
      amount: "",
      quantity: 1,
      bio: "",
      category: "",
      tags: [],
      agreeTerms: false,
      notifications: true,
      gender: "other",
      budgetLimit: 500,
      eventDate: null,
      eventTime: null,
      dateRange: null,
      timeRange: null,
      profilePic: null,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted Successfully! Raw Values:", data);
    alert(
      "Form submitted successfully! Check console for full typed logs.\n\n" +
        JSON.stringify(
          {
            ...data,
            profilePic: data.profilePic ? `${data.profilePic.name} (${data.profilePic.size} bytes)` : null,
          },
          null,
          2
        )
    );
  };

  const selectOptions = [
    { id: "1", label: "Food & Dining", key: "food" },
    { id: "2", label: "Transportation", key: "transport" },
    { id: "3", label: "Entertainment", key: "entertainment" },
    { id: "4", label: "Utilities", key: "utilities" },
  ];

  const tagOptions = [
    { id: "1", label: "Essential", key: "essential" },
    { id: "2", label: "Work", key: "work" },
    { id: "3", label: "Personal", key: "personal" },
    { id: "4", label: "Subscribed", key: "subscribed" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6 bg-black text-white rounded-2xl border border-gray-800 shadow-2xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-white">Daily Expense & Hook Form Demo</h1>
        <p className="text-sm text-gray-400">
          This form showcases direct integration between our custom components and <code className="text-sky-400 bg-gray-900 px-1 py-0.5 rounded text-xs">react-hook-form</code>.
          Submit with empty fields to trigger validations and review custom error styling.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Standard Input with Floating Label */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">1. Floating Label Input</label>
            <Input
              isFloating={true}
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register("fullName", { required: "Full name is required" })}
            />
          </div>

          {/* 2. EmailInput */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">2. Email Input</label>
            <EmailInput
              label="Email Address"
              placeholder="example@domain.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>

          {/* 3. PhoneInput */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">3. Phone Input</label>
            <PhoneInput
              label="Phone Number"
              placeholder="1234567890"
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "Phone must be 10 digits" },
              })}
            />
          </div>

          {/* 4. URLInput */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">4. URL Input</label>
            <URLInput
              label="Website"
              placeholder="https://example.com"
              error={errors.website?.message}
              {...register("website", { required: "Website URL is required" })}
            />
          </div>

          {/* 5. NumberInput */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">5. Number Input</label>
            <Controller
              name="quantity"
              control={control}
              rules={{
                required: "Quantity is required",
                min: { value: 1, message: "Min quantity is 1" },
              }}
              render={({ field }) => (
                <NumberInput
                  label="Quantity"
                  placeholder="Enter number"
                  min={1}
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                  error={errors.quantity?.message}
                />
              )}
            />
          </div>

          {/* 6. AmountInput */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">6. Amount Input</label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <AmountInput
                  label="Amount / Cost"
                  placeholder="0.00"
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={errors.amount?.message}
                />
              )}
            />
          </div>

          {/* 7. DatePicker (Controlled) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">7. Date Picker</label>
            <Controller
              name="eventDate"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  label="Select Date"
                  value={field.value || undefined}
                  onChange={(date) => field.onChange(date)}
                  error={errors.eventDate?.message}
                />
              )}
            />
          </div>

          {/* 8. TimePicker (Controlled) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">8. Time Picker</label>
            <Controller
              name="eventTime"
              control={control}
              rules={{ required: "Time is required" }}
              render={({ field }) => (
                <TimePicker
                  label="Select Time"
                  value={field.value}
                  onChange={(time) => field.onChange(time)}
                  error={errors.eventTime?.message}
                />
              )}
            />
          </div>

          {/* 8a. Date Range Picker (Controlled) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">8a. Date Range Picker</label>
            <Controller
              name="dateRange"
              control={control}
              rules={{ required: "Date range is required" }}
              render={({ field }) => (
                <DateRangePicker
                  label="Select Date Range"
                  value={field.value || undefined}
                  onChange={(val) => field.onChange(val)}
                  error={errors.dateRange?.message}
                />
              )}
            />
          </div>

          {/* 8b. Time Range Picker (Controlled) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">8b. Time Range Picker</label>
            <Controller
              name="timeRange"
              control={control}
              rules={{ required: "Time range is required" }}
              render={({ field }) => (
                <TimeRangePicker
                  label="Select Time Range"
                  value={field.value || undefined}
                  onChange={(val) => field.onChange(val)}
                  error={errors.timeRange?.message}
                />
              )}
            />
          </div>

          {/* 9. SelectInput (Controlled Dropdown) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">9. Single Select Input</label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Please select a category" }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-white">Expense Category</span>
                  <SelectInput
                    options={selectOptions}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.category?.message}
                  />
                  {errors.category && (
                    <span className="text-xs font-medium text-red-500 mt-1">{errors.category.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* 10. MultiSelectInput (Controlled Dropdown) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">10. Multi Select Input</label>
            <Controller
              name="tags"
              control={control}
              rules={{ validate: (val) => (val && val.length > 0) || "Select at least one tag" }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-white">Expense Tags</span>
                  <MultiSelectInput
                    options={tagOptions}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.tags?.message}
                  />
                  {errors.tags && (
                    <span className="text-xs font-medium text-red-500 mt-1">{errors.tags.message}</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* 11. RangeSlider (Controlled) */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">11. Range Slider</label>
            <Controller
              name="budgetLimit"
              control={control}
              render={({ field }) => (
                <RangeSlider
                  label={`Budget Limit: $${field.value}`}
                  min={0}
                  max={2000}
                  step={50}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
          </div>

          {/* 12. FileInput (Controlled) */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">12. File Input (Dropzone)</label>
            <Controller
              name="profilePic"
              control={control}
              rules={{ required: "An attachment file is required" }}
              render={({ field }) => (
                <FileInput
                  label="Attach Receipt"
                  maxFileSize={5}
                  error={errors.profilePic?.message}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      field.onChange(files[0]);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              )}
            />
          </div>

          {/* 13. TextArea */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">13. TextArea Input</label>
            <TextArea
              label="Bio / Notes"
              placeholder="Provide a description of the expense..."
              error={errors.bio?.message}
              {...register("bio", { required: "Notes are required" })}
            />
          </div>

          {/* 14. RadioGroup (Controlled) */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">14. Radio Group</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Billing Category"
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  options={[
                    { value: "personal", label: "Personal" },
                    { value: "business", label: "Business" },
                    { value: "other", label: "Other / Shared" },
                  ]}
                />
              )}
            />
          </div>

          {/* 15. Switch & 16. Checkbox (Controlled) */}
          <div className="flex flex-col justify-center gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">15 & 16. Switch & Checkbox</label>
            
            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Enable Email Notifications"
                  checked={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            <Controller
              name="agreeTerms"
              control={control}
              rules={{ required: "You must accept the terms" }}
              render={({ field }) => (
                <Checkbox
                  label="I agree to the terms of service"
                  checked={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.agreeTerms?.message}
                />
              )}
            />
          </div>

        </div>

        <Flex justify="end" className="mt-4 pt-4 border-t border-gray-800">
          <Button type="submit" className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-xl shadow-lg cursor-pointer">
            Submit Expense
          </Button>
        </Flex>
      </form>
    </div>
  );
};
