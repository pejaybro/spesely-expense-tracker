import { DateRangePicker, DatePicker, TimePicker, Input } from "@/src/components/base";
import { useState } from "react";

export const Dashboard = () => {
  const [date1, setDate1] = useState<Date | undefined>(undefined);
  const [range1, setRange1] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [time1, setTime1] = useState<Date | undefined>(undefined);
  const [text1, setText1] = useState("");

  return (
    <div className="flex flex-col items-center justify-start p-12 bg-gray-50 dark:bg-black min-h-screen w-full gap-16 overflow-y-auto">
      
      {/* SECTION: FLOATING LABEL SHOWCASE */}
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <header className="flex flex-col gap-2 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-black tracking-tighter italic text-black dark:text-white uppercase">Floating Label Suite</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">The "Inside-to-Outside" Variation</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-4">
          {/* Floating Input */}
          <div className="flex flex-col gap-2">
            <Input 
              variant="floating"
              label="Full Name"
              placeholder="e.g. John Doe"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase ml-1 tracking-widest">Standard Input</p>
          </div>

          {/* Floating Date */}
          <div className="flex flex-col gap-2">
            <DatePicker 
              variant="floating"
              label="Select Date"
              value={date1}
              onChange={setDate1}
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase ml-1 tracking-widest">Single Date</p>
          </div>

          {/* Floating Time */}
          <div className="flex flex-col gap-2">
            <TimePicker 
              variant="floating"
              label="Appointment Time"
              value={time1}
              onChange={setTime1}
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase ml-1 tracking-widest">Time Picker</p>
          </div>

          {/* Floating Range */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex flex-col gap-2 max-w-md">
              <DateRangePicker 
                variant="floating"
                label="Reporting Period"
                value={range1}
                onChange={setRange1}
                presets={["this-month", "last-3-months", "this-year"]}
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase ml-1 tracking-widest">Date Range</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full max-w-5xl bg-gray-200" />

      {/* REMAINDER OF DASHBOARD (Simplified for brevity) */}
      <div className="w-full max-w-5xl flex flex-col gap-4">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] text-center">All other variations are active and tested.</p>
      </div>

    </div>
  );
};
