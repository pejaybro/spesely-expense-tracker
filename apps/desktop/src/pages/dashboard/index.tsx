import { useState } from "react";
import { CheckboxGroup, RadioGroup } from "@/src/components/base";
import { Settings, Bell } from "lucide-react";

export const Dashboard = () => {
  // CheckboxGroup States
  const [chkDefault, setChkDefault] = useState<string[]>(["email", "push"]);
  const [chkSingle, setChkSingle] = useState<string>("pro");
  const [chkNumbered, setChkNumbered] = useState<string[]>([]);
  const [chkDisabled, setChkDisabled] = useState<string[]>(["tos"]);

  // RadioGroup States
  const [radDefault, setRadDefault] = useState<string>("credit");
  const [radDots, setRadDots] = useState<string>("standard");
  const [radPlacement, setRadPlacement] = useState<string>("monthly");
  const [radDisabled, setRadDisabled] = useState<string>("available");

  // Options Definitions
  const notificationOptions = [
    {
      value: "email",
      label: "Email Notifications",
      description: "Receive updates, billing info, and newsletters.",
    },
    {
      value: "sms",
      label: "SMS Alerts",
      description: "Critical security notifications sent to your phone.",
    },
    {
      value: "push",
      label: "Push Notifications",
      description: "Real-time updates directly in your browser or desktop app.",
    },
  ];

  const planOptions = [
    {
      value: "free",
      label: "Free Plan",
      description: "Access basic expense tracking and monthly reports.",
    },
    {
      value: "pro",
      label: "Pro Subscription",
      description: "Unlimited tracking, advanced analytics, and bank sync.",
    },
    {
      value: "enterprise",
      label: "Enterprise Tier",
      description: "Team collaboration tools, dedicated support, and custom APIs.",
    },
  ];

  const workflowOptions = [
    { value: "fetch", label: "Retrieve Transaction Data", description: "Fetch raw logs from bank feed" },
    { value: "parse", label: "Clean and Categorize", description: "Standardize fields and auto-tag categories" },
    { value: "store", label: "Commit to Ledger", description: "Save immutable transaction records" },
    { value: "notify", label: "Trigger Notifications", description: "Email alert on large debits" },
  ];

  const agreementOptions = [
    {
      value: "tos",
      label: "Accept Terms of Service",
      description: "Read and agree to our licensing rules.",
    },
    {
      value: "privacy",
      label: "Accept Privacy Policy",
      description: "Required for data synchronization features.",
    },
    {
      value: "marketing",
      label: "Opt-in to Marketing Updates",
      description: "We will only send high-quality updates once a month.",
      disabled: true,
    },
  ];

  const paymentOptions = [
    {
      value: "credit",
      label: "Credit or Debit Card",
      description: "Supports Visa, Mastercard, and American Express.",
    },
    {
      value: "paypal",
      label: "PayPal Account",
      description: "Fast checkout using your saved credentials.",
    },
    {
      value: "crypto",
      label: "Cryptocurrency (BTC/ETH)",
      description: "Secure, decentralized anonymous payment.",
    },
  ];

  const shipmentOptions = [
    { value: "economy", label: "Economy Ground", description: "Delivered in 5-7 business days." },
    { value: "standard", label: "Standard Shipping", description: "Delivered in 3-4 business days." },
    { value: "express", label: "Express Air", description: "Guaranteed 1-2 business days." },
  ];

  const cycleOptions = [
    { value: "monthly", label: "Monthly Billing" },
    { value: "annual", label: "Annual Billing (Save 20%)" },
  ];

  const availabilityOptions = [
    { value: "available", label: "Online & Available", description: "Receive all task allocations immediately." },
    { value: "busy", label: "Do Not Disturb", description: "Pause incoming sound alerts and banners." },
    { value: "offline", label: "Offline", description: "Appear logged out to other workspace members.", disabled: true },
  ];

  return (
    <div className="flex flex-col items-center justify-start p-8 min-h-screen w-full gap-8 overflow-y-auto bg-black text-white selection:bg-sky-500 selection:text-black">
      {/* Page Header */}
      <div className="w-full max-w-6xl flex flex-col gap-2 border-b border-gray-900 pb-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-950/40 border border-sky-800/30 rounded-full">
            Component Audit
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Form Group Variations
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Visual and functional audit of CheckboxGroup and RadioGroup components supporting multiple alignments, dynamic prefixes/indicators, and states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* ================= CHECKBOX GROUP VARIATIONS ================= */}
        <div className="flex flex-col gap-8 p-6 bg-gray-950 border border-gray-900 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="text-sky-400" size={20} />
              <h2 className="text-xl font-bold tracking-tight text-white">CheckboxGroup</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Multi-value checkboxes wrapped inside layout and validation containers.</p>
          </div>

          <div className="flex flex-col gap-8">
            {/* 1. Default Multiple Selection */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                1. Standard Multi-Select
              </h3>
              <CheckboxGroup
                label="Notification Subscriptions"
                description="Choose the channels where you wish to receive updates"
                options={notificationOptions}
                value={chkDefault}
                onChange={setChkDefault}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Selected values: {JSON.stringify(chkDefault)}
              </div>
            </div>

            {/* 2. Single Selection Mode */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                2. Single-Selection Checkboxes
              </h3>
              <CheckboxGroup
                label="Subscription Plan"
                description="Selecting an option clears other selections (behaving like a radio group)"
                type="single"
                options={planOptions}
                value={chkSingle}
                onChange={setChkSingle}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Selected value: "{chkSingle}"
              </div>
            </div>

            {/* 3. Numbered Options Indicator */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                3. Numbered Option Layout
              </h3>
              <CheckboxGroup
                label="Required Deployment Steps"
                description="Sequence steps are styled with integer prefixes"
                indicator="numbers"
                options={workflowOptions}
                value={chkNumbered}
                onChange={setChkNumbered}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Completed steps: {JSON.stringify(chkNumbered)}
              </div>
            </div>

            {/* 4. Disabled Options and Left Alignment */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                4. Left Label Alignment & Disabled State
              </h3>
              <CheckboxGroup
                label="Legal Audits"
                description="Acceptance checklist"
                labelPlacement="left"
                labelWidth="w-40"
                options={agreementOptions}
                value={chkDisabled}
                onChange={setChkDisabled}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Accepted: {JSON.stringify(chkDisabled)}
              </div>
            </div>

            {/* 5. CheckboxGroup with Validation Error */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                5. Validation Error State
              </h3>
              <CheckboxGroup
                label="Compliance Attestation"
                description="Declare status under corporate policy"
                options={[
                  { value: "agree", label: "I confirm all reported transactions are business-related." }
                ]}
                error="You must certify compliance before proceeding to submit expense reports."
              />
            </div>
          </div>
        </div>

        {/* ================= RADIO GROUP VARIATIONS ================= */}
        <div className="flex flex-col gap-8 p-6 bg-gray-950 border border-gray-900 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="text-sky-400" size={20} />
              <h2 className="text-xl font-bold tracking-tight text-white">RadioGroup</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Single-value selection radios wrapped inside layout and validation containers.</p>
          </div>

          <div className="flex flex-col gap-8">
            {/* 1. Default Selection */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                1. Standard Radio Selection
              </h3>
              <RadioGroup
                label="Payment Method"
                description="Select how you want your invoices processed"
                options={paymentOptions}
                value={radDefault}
                onChange={setRadDefault}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Active option: "{radDefault}"
              </div>
            </div>

            {/* 2. Dots/Bullets List Indicator */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                2. Bullet List Indicator
              </h3>
              <RadioGroup
                label="Delivery Speed"
                description="Delivery estimations based on address profile"
                indicator="dots"
                options={shipmentOptions}
                value={radDots}
                onChange={setRadDots}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Active speed: "{radDots}"
              </div>
            </div>

            {/* 3. Horizontal Right Alignment */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                3. Right Label Alignment
              </h3>
              <RadioGroup
                label="Billing Plan"
                description="Frequency of recurring charges"
                labelPlacement="right"
                labelWidth="w-36"
                options={cycleOptions}
                value={radPlacement}
                onChange={setRadPlacement}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Cycle: "{radPlacement}"
              </div>
            </div>

            {/* 4. Disabled Options */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                4. Disabled State & Description
              </h3>
              <RadioGroup
                label="Workspace Presence"
                description="Controls how you appear on workspace updates"
                options={availabilityOptions}
                value={radDisabled}
                onChange={setRadDisabled}
              />
              <div className="text-xs text-gray-600 bg-gray-950 border border-gray-900 rounded px-2.5 py-1.5 mt-1 self-start font-mono">
                Availability: "{radDisabled}"
              </div>
            </div>

            {/* 5. RadioGroup with Validation Error */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
                5. Validation Error State
              </h3>
              <RadioGroup
                label="Authorize Autopay"
                description="Enable direct debit for future billing periods"
                options={[
                  { value: "yes", label: "Yes, charge my card automatically each period." },
                  { value: "no", label: "No, send an invoice manually each period." },
                ]}
                error="Selecting automatic billing authorization is required to enable trial accounts."
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
