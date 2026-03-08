import { useEffect, useState } from "react";
import "./electron.css";
import dayjs from "@/root.config";
import {  Flex } from "@/src/components/base";
import { ChevronLeft, ChevronRight, Minus, Square, X } from "lucide-react";

export const WindowTitleBar = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      setDate(dayjs(now).format("dddd, MMMM D"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex direction="row" justify="between" className="bg-black text-white">
      {/* LEFT SECTION */}
      <div className="titlebar-left">
        <button className="nav">
          <ChevronLeft />
        </button>
        <button className="nav">
          <ChevronRight />
        </button>

        <div className="logo">SPESLEY</div>
       
      </div>

      {/* CENTER SECTION */}
      <div className="titlebar-center">
        <div className="info">{time}</div>

        <div className="info">{date}</div>
      </div>

      {/* RIGHT SECTION */}
      <div className="titlebar-right">
        <button
          onClick={() => window.electronAPI.minimize()}
          className="win-btn"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => window.electronAPI.maximize()}
          className="win-btn"
        >
          <Square size={14} />
        </button>
        <button
          onClick={() => window.electronAPI.close()}
          className="win-btn close"
        >
          <X size={16} />
        </button>
      </div>
    </Flex>
  );
};
