const selectInput = () => {
return (

<div className="w-screen h-screen relative bg-gray-100">
<div className="absolute top-4 left-4">
<MySelect />
<MultiSelect />
</div>
</div>
);
};

const options = [
{ label: "Option 1", value: 1 },
{ label: "Option 2", value: 2 },
{ label: "Option 3", value: 3 },
{ label: "Option 4", value: 4 },
{ label: "Option 5", value: 5 },
{ label: "ss 6", value: 6 },
{ label: "Option 7", value: 7 },
{ label: "Option 8", value: 8 },
{ label: "Option 9", value: 9 },
{ label: "GG 10", value: 10 },
];

const MySelect = ({
width = "w-50",
isSearchable = false,
isMultiSelect = false,
}: {
width?: string;
isSearchable?: boolean;
isMultiSelect?: boolean;
}) => {
const [dropDownOpen, setDropDownOpen] = useState(false);
const [openUpward, setOpenUpward] = useState(false);
const triggerRef = useRef<HTMLInputElement>(null);
const dropdownRef = useRef<HTMLDivElement>(null);
const typeBuffer = useRef("");
const typeTimeout = useRef<any>(null);
const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
const [selected, setSelected] = useState<any[]>([]);
const [highlightedIndex, setHighlightedIndex] = useState(-1);
const [inputValue, setInputValue] = useState("");
const [isNavigating, setIsNavigating] = useState(false); // ← NEW
const dropdownHeight = dropdownRef.current?.offsetHeight || 200;

useLayoutEffect(() => {
if (dropDownOpen && triggerRef.current) {
const rect = triggerRef.current.getBoundingClientRect();
const spaceBelow = window.innerHeight - rect.bottom;
const spaceAbove = rect.top;

      const shouldOpenUp =
        spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

      setOpenUpward(shouldOpenUp);

      setPosition({
        left: rect.left,
        width: rect.width,
        top: shouldOpenUp ? rect.top : rect.bottom,
      });
    }

}, [dropDownOpen]);

useEffect(() => {
if (!dropDownOpen) return;
if (!dropdownRef.current) return;

    const el = dropdownRef.current?.children?.[highlightedIndex] as HTMLElement;

    if (el) {
      el.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }

}, [highlightedIndex, dropDownOpen]);

useEffect(() => {
const handleClickOutside = (e: MouseEvent) => {
const target = e.target as Node;

      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);

      if (!clickedTrigger && !clickedDropdown) {
        setDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

}, []);

const handleDropDown = () => {
setDropDownOpen((prev) => {
const next = !prev;

      if (!prev) {
        // On open: land on last selected item, not index 0
        const lastSelected = selected[selected.length - 1];
        const index = filteredOptions.findIndex(
          (opt) => opt.value === lastSelected?.value,
        );
        setHighlightedIndex(index >= 0 ? index : 0);
        setIsNavigating(true); // ← hide caret on open
        setInputValue("");
      } else {
        setIsNavigating(false);
      }

      return next;
    });

};

const handleSelectValue = (value: any, label: any) => {
if (isMultiSelect) {
setSelected((prev) => {
const exists = prev.find((item) => item.value === value);
if (exists) {
return prev.filter((item) => item.value !== value);
} else {
return [...prev, { value, label }];
}
});

      setInputValue("");
      // Stay on the item just selected
      const indexInFullList = options.findIndex((o) => o.value === value);
      setHighlightedIndex(indexInFullList >= 0 ? indexInFullList : 0);
      setIsNavigating(true); // ← keep caret hidden after select
      return;
    }

    // single select
    const isAlreadySelected = selected[0]?.value === value;

    if (isAlreadySelected) {
      setSelected([]);
    } else {
      setSelected([{ value, label }]);
    }

    setInputValue("");
    setIsNavigating(false);
    setDropDownOpen(false);

};

const handleKeyDown = (e: any) => {
if (e.disabled || e.readOnly) return;

    // =========================
    // TYPEAHEAD (non-searchable only, dropdown open)
    // =========================
    if (
      !isSearchable &&
      dropDownOpen &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      typeBuffer.current += e.key.toLowerCase();

      const matchIndex = filteredOptions.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(typeBuffer.current),
      );

      if (matchIndex !== -1) {
        setHighlightedIndex(matchIndex);
      }

      if (typeTimeout.current) clearTimeout(typeTimeout.current);

      typeTimeout.current = setTimeout(() => {
        typeBuffer.current = "";
      }, 500);

      return;
    }

    // =========================
    // CLOSED STATE SHORTCUTS
    // =========================
    if (!dropDownOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setDropDownOpen(true);
        setIsNavigating(true); // ← hide caret on keyboard open
        const lastSelected = selected[selected.length - 1];
        const index = filteredOptions.findIndex(
          (opt) => opt.value === lastSelected?.value,
        );
        setHighlightedIndex(index >= 0 ? index : 0);
      }
      return;
    }

    // =========================
    // OPEN STATE CONTROLS
    // =========================

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsNavigating(true);
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsNavigating(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1,
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const item = filteredOptions[highlightedIndex];
      if (item) {
        handleSelectValue(item.value, item.label);
      }
      return;
    }

    if (e.key === "Escape") {
      setDropDownOpen(false);
      setIsNavigating(false);
      return;
    }

};

const filteredOptions =
inputValue.trim() === ""
? options
: options.filter((opt) =>
opt.label.toLowerCase().includes(inputValue.toLowerCase()),
);

return (
<>

<div ref={triggerRef} className="relative inline-block">
<div
onClick={handleDropDown}
onKeyDown={handleKeyDown}
tabIndex={0}
className={cn(
"select-none flex flex-row h-8 items-center justify-between rounded-md px-2 py-1 bg-red-500 text-white cursor-pointer",
width,
)} >
<div className="pr-2">
<TextAlignJustify size={18} />
</div>

          {isSearchable ? (
            <input
              value={
                dropDownOpen
                  ? inputValue
                  : isMultiSelect
                    ? selected.length > 0
                      ? `${selected.length} selected`
                      : ""
                    : selected[0]?.label || ""
              }
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsNavigating(false); // ← typing restores caret
                setDropDownOpen(true);
                setHighlightedIndex(0);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setDropDownOpen(true);
              }}
              className={cn(
                "w-full bg-transparent outline-none text-white",
                isNavigating && "caret-transparent", // ← hide caret when navigating
              )}
              placeholder="Search..."
            />
          ) : (
            <span className="flex-1 min-w-0 truncate">
              {isMultiSelect && !isSearchable
                ? selected.length > 0
                  ? `${selected.length} selected`
                  : "Select"
                : selected[0]?.label || "Select"}
            </span>
          )}
          <div className="pl-2">
            {dropDownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        {dropDownOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                top: openUpward
                  ? position.top - dropdownHeight - 2
                  : position.top + 2,
                left: position.left,
                zIndex: 9999,
              }}
              className={cn(
                "border border-red-500 rounded-md flex flex-col max-h-[250px] min-h-0 overflow-y-auto bg-red-500 no-scrollbar p-0.5 gap-y-0.5 ",
                width,
              )}
            >
              {filteredOptions.map((item, index) => {
                const isSelected = selected.some((s) => s.value === item.value);
                const isHighlighted = highlightedIndex === index;
                return (
                  <div
                    key={`${item.value}-${index}`}
                    onClick={() => handleSelectValue(item.value, item.label)}
                    className={cn(
                      "flex flex-row justify-between items-center select-none cursor-pointer rounded-md p-1 leading-tight",
                      isHighlighted
                        ? "bg-red-300"
                        : "hover:bg-red-100 bg-red-200",
                    )}
                  >
                    <span className="flex-1"> {item.label}</span>

                    {isSelected && (
                      <span className="text-white pl-2">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>,
            document.body,
          )}
      </div>
    </>

);
};

const MultiSelect = ({ width = "w-100" }: { width?: string }) => {
const [open, setOpen] = useState(false);
const [selected, setSelected] = useState<any[]>([]);
const [inputValue, setInputValue] = useState("");
const [highlightedIndex, setHighlightedIndex] = useState(0);
const [isNavigating, setIsNavigating] = useState(false);
const [openUpward, setOpenUpward] = useState(false);
const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

const containerRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);
const dropdownRef = useRef<HTMLDivElement>(null);

// =========================
// CLOSE OUTSIDE
// =========================
useEffect(() => {
const handleClickOutside = (e: MouseEvent) => {
if (
!containerRef.current?.contains(e.target as Node) &&
!dropdownRef.current?.contains(e.target as Node)
) {
setOpen(false);
setInputValue("");
}
};

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

}, []);

// =========================
// POSITION DROPDOWN (portal)
// =========================
useLayoutEffect(() => {
if (open && containerRef.current) {
const rect = containerRef.current.getBoundingClientRect();
const dropdownHeight = dropdownRef.current?.offsetHeight || 200;
const spaceBelow = window.innerHeight - rect.bottom;
const spaceAbove = rect.top;

      const shouldOpenUp =
        spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

      setOpenUpward(shouldOpenUp);
      setPosition({
        left: rect.left,
        width: rect.width,
        top: shouldOpenUp ? rect.top : rect.bottom,
      });
    }

}, [open]);

// =========================
// SCROLL HIGHLIGHTED INTO VIEW
// =========================
useEffect(() => {
if (!open || !dropdownRef.current) return;
const el = dropdownRef.current.children[highlightedIndex] as HTMLElement;
if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}, [highlightedIndex, open]);

// =========================
// FILTER OPTIONS
// =========================
const filteredOptions =
inputValue.trim() === ""
? options
: options.filter((opt) =>
opt.label.toLowerCase().includes(inputValue.toLowerCase()),
);

// =========================
// TOGGLE SELECT
// =========================
const toggleSelect = (item: any) => {
setSelected((prev) => {
const exists = prev.find((i) => i.value === item.value);
return exists
? prev.filter((i) => i.value !== item.value)
: [...prev, item];
});

    setInputValue("");
    const indexInFullList = options.findIndex((o) => o.value === item.value);
    setHighlightedIndex(indexInFullList >= 0 ? indexInFullList : 0);
    setIsNavigating(true);

    inputRef.current?.focus();

};

// =========================
// REMOVE CHIP
// =========================
const removeItem = (value: any) => {
setSelected((prev) => prev.filter((i) => i.value !== value));
};

// =========================
// KEYBOARD
// =========================
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (!open) {
if (e.key === "Enter" || e.key === "ArrowDown") {
e.preventDefault();
setOpen(true);
setIsNavigating(true);
const firstSelectedIndex =
selected.length > 0
? filteredOptions.findIndex(
(o) => o.value === selected[selected.length - 1].value,
)
: -1;
setHighlightedIndex(firstSelectedIndex >= 0 ? firstSelectedIndex : 0);
}
return;
}

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsNavigating(true);
      setHighlightedIndex((p) => (p < filteredOptions.length - 1 ? p + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsNavigating(true);
      setHighlightedIndex((p) => (p > 0 ? p - 1 : filteredOptions.length - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredOptions[highlightedIndex];
      if (item) toggleSelect(item);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      setInputValue("");
      setIsNavigating(false);
      return;
    }

    if (e.key === "Backspace" && inputValue === "") {
      setSelected((prev) => prev.slice(0, -1));
    }

};

return (

<div ref={containerRef} className={cn("relative inline-block")}>
{/_ =========================
TRIGGER
========================= _/}
<div
onClick={() => {
if (!open) {
const firstSelectedIndex =
selected.length > 0
? options.findIndex(
(o) => o.value === selected[selected.length - 1].value,
)
: -1;
setHighlightedIndex(
firstSelectedIndex >= 0 ? firstSelectedIndex : 0,
);
setIsNavigating(true);
}
setOpen(true);
inputRef.current?.focus();
}}
className={cn(
"select-none flex flex-row items-center justify-between rounded-md px-2 py-1 bg-red-500 text-white cursor-pointer",
width,
)} >
{/_ LEFT ICON _/}
<div className="pr-2 flex items-center">
<TextAlignJustify size={18} />
</div>

        {/* CHIPS + INPUT */}
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.map((item) => (
            <div
              key={item.value}
              className="flex items-center gap-1 bg-red-300 px-2 py-0.5 rounded-md text-xs"
            >
              <span className="truncate max-w-[80px]">{item.label}</span>
              <X
                size={14}
                className="cursor-pointer hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.value);
                }}
              />
            </div>
          ))}

          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsNavigating(false);
              setHighlightedIndex(0);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 min-w-10 bg-transparent outline-none text-white placeholder:text-white/70",
              isNavigating && "caret-transparent",
            )}
            placeholder={selected.length === 0 ? "Select..." : ""}
          />
        </div>

        {/* RIGHT ICON */}
        <div className="pl-2">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* =========================
          DROPDOWN (portal)
      ========================= */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: openUpward
                ? position.top - (dropdownRef.current?.offsetHeight || 200) - 2
                : position.top + 2,
              left: position.left,
              width: position.width,
              zIndex: 9999,
            }}
            className="bg-red-500 border border-red-500 rounded-md max-h-60 overflow-y-auto no-scrollbar p-0.5 flex flex-col gap-y-0.5"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-white/60 text-sm select-none">
                No results
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const isSelected = selected.some((s) => s.value === item.value);
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={item.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggleSelect(item)}
                    className={cn(
                      "flex justify-between items-center px-3 py-1.5 cursor-pointer rounded-md select-none leading-tight",
                      isHighlighted
                        ? "bg-red-300"
                        : "bg-red-200 hover:bg-red-100",
                    )}
                  >
                    <span className="flex-1 text-sm">{item.label}</span>
                    {isSelected && (
                      <Check size={14} className="text-white ml-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </div>

);
};

export default selectInput;
