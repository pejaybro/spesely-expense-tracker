import {  CheckboxGroup, RadioGroup } from "@/src/components/base";

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start p-12 min-h-screen w-full gap-5 overflow-y-auto">
      <CheckboxGroup
        options={[{ id: "1", label: "option1", value : "1" },{ id: "2", label: "option2", value : "2" }]}        
        label="hello"
        indicator="dots"
        description="hello description"
      />
      <RadioGroup
        options={[{ id: "1", label: "option1", value : "1" },{ id: "2", label: "option2", value : "2" }]}        
        label="hello"      
        description="hello description"
      />
    </div>
  );
};
