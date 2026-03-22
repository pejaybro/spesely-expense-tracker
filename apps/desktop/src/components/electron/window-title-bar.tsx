import { useEffect, useState } from "react";
import dayjs from "@/root.config";
import { Flex, Btn } from "@/src/components/base";
import { ChevronLeft, ChevronRight, Minus, Square, X } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export const WindowTitleBar = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Simple history state tracking
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Current history index tracking
    const historyState = window.history.state;
    const currentIdx = historyState?.idx || 0;

    setCanGoBack(currentIdx > 0);
    setCanGoForward(currentIdx < window.history.length - 1);
  }, [location]);

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
    <Flex
      direction="row"
      justify="between"
      items="center"
      className="h-8 bg-dark-c1 text-white w-full select-none window-drag"
    >
      {/* ======================================= */}
      {/* ANCHOR : LEFT SECTION */}
      <Flex
        direction="row"
        items="center"
        noGap
        className="px-2.5 window-no-drag"
      >
        <Btn
          variant="solid"
          onClick={() => navigate(-1)}
          disabled={!canGoBack}
          className={`rounded-l-md size-6 px-0 bg-transparent! hover:bg-white/10! ${
            !canGoBack ? "text-white/20! cursor-pointer!" : "text-white"
          }`}
        >
          <ChevronLeft size={16} />
        </Btn>
        <Btn
          variant="solid"
          onClick={() => navigate(1)}
          disabled={!canGoForward}
          className={`rounded-r-md size-6 px-0 bg-transparent! hover:bg-white/10! ${
            !canGoForward ? "text-white/20! cursor-pointer!" : "text-white"
          }`}
        >
          <ChevronRight size={16} />
        </Btn>
      </Flex>

      {/* ======================================= */}
      {/* ANCHOR : RIGHT SECTION */}
      <Flex direction="row" items="center" className="gap-1 window-no-drag">
        <Btn
          variant="solid"
          className="w-8 px-0 bg-transparent! hover:bg-white/10!"
          onClick={() => window.electronAPI.minimize()}
        >
          <Minus size={16} />
        </Btn>
        <Btn
          variant="solid"
          className="w-8 px-0 bg-transparent! hover:bg-white/10!"
          onClick={() => window.electronAPI.maximize()}
        >
          <Square size={12} />
        </Btn>
        <Btn
          variant="solid"
          className="w-8 px-0 bg-transparent! hover:bg-red-600!"
          onClick={() => window.electronAPI.close()}
        >
          <X size={16} />
        </Btn>
      </Flex>
    </Flex>
  );
};
