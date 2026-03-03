import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NepaliDate, { formatADDate } from "@zener/nepali-date";
import Menu from "./menu";
import { cn } from "../utils/commons";
import { CloseIcon } from "../icons";
import type { DateTypeMap, INepaliDatePicker } from "./types";
import "../css/index.css";
import useFloatingAdvanced from "../utils/use-floating-advance";

const NepaliDatePicker = <T extends keyof DateTypeMap | undefined = "BS">({
  type = "BS",
  open,
  disabled,
  placeholder,
  onChange,
  className,
  value,
  lang = "np",
  menuContainerClassName,
  calendarClassName,
  portalClassName,
  components,
  prefix,
  suffix,
  showclear = true,
  converterMode,
  format = "YYYY-MM-DD",
  max,
  min,
  alignmentOptions,
}: INepaliDatePicker<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | Date | null>();
  const [inputValue, setInputValue] = useState<string>("");
  const [today, setToday] = useState(
    type === "BS" ? new NepaliDate() : new Date(),
  );

  const { bounds } = useFloatingAdvanced(
    containerRef,
    portalRef,
    show || !!open,
    [],
    { ...alignmentOptions, shift: true, flip: true },
  );

  useEffect(() => {
    setToday(type === "BS" ? new NepaliDate() : new Date());
  }, []);

  useEffect(() => {
    setToday(type === "BS" ? new NepaliDate() : new Date());
  }, [type]);

  useEffect(() => {
    if (selectedDate) {
      if (type === "BS") {
        setInputValue((selectedDate as NepaliDate).format(format, lang));
      } else {
        setInputValue(formatADDate(selectedDate as Date, format, lang));
      }
    } else {
      setInputValue("");
    }
  }, [selectedDate]);

  const closeMenu = () => {
    if (!open) {
      setShow(false);
    }
  };

  useLayoutEffect(() => {
    setShow(!!open);
  }, [open]);

  useEffect(() => {
    if (value) {
      switch (type) {
        case "AD":
          if (typeof value === "string" || value instanceof Date) {
            setSelectedDate(new Date(value));
          }
          break;
        case "BS":
        default:
          if (typeof value === "string" || value instanceof NepaliDate) {
            setSelectedDate(new NepaliDate(value));
          }
          break;
      }
    } else {
      setSelectedDate(null);
    }
  }, [value, lang, type, format]);

  // set focus on input container
  const setFocus = () => {
    if (disabled) {
      return;
    }

    if (className && typeof className === "function" && !!className().focus) {
      containerRef.current?.classList.add(
        ...(className().focus?.split(" ") || [""]),
      );
    }
  };

  // remove focus from input container
  const removeFocus = () => {
    if (className && typeof className === "function" && !!className().focus) {
      containerRef.current?.classList.remove(
        ...(className().focus?.split(" ") || [""]),
      );
      containerRef.current?.classList.add(
        ...(className().default?.split(" ") || [""]),
      );
    }
  };

  const clear = () => {
    setSelectedDate(undefined);
    onChange?.(null);
  };

  return (
    <div className="zener w-full">
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-row items-center",
          {
            "text-input-disabled-text bg-input-disabled-bg border-input-disabled-border":
              !className && !!disabled,
          },
          className && typeof className === "function"
            ? `${disabled ? className().disabled : className().default}`
            : className ||
                `${!disabled ? "focus:ring-1 focus:ring-input-focus-ring focus-within:ring-1 focus-within:ring-input-focus-ring" : ""} font-sans bg-input-bg text-sm px-2 py-0.5 border-solid border border-input-border rounded min-w-[122px] outline-none w-full text-input-text`,
        )}
        onFocus={() => {
          if (disabled) {
            return;
          }
          setFocus();
        }}
        onBlur={() => {
          removeFocus();
        }}
      >
        {prefix && <div>{prefix}</div>}
        <input
          className="outline-none focus-visible:outline-none focus:outline-none focus-within:outline-none border-0 w-fit bg-transparent flex-1 text-inherit min-h-[24px]"
          size={10}
          tabIndex={0}
          ref={inputRef}
          type="text"
          disabled={disabled}
          readOnly
          onClick={() => {
            if (!disabled) {
              if (!open) {
                setShow((prev) => !prev);
              }
            }
          }}
          onBlur={(e) => {
            const rT = e.relatedTarget;
            const isInMenu = portalRef.current?.contains(rT);
            if (isInMenu) {
              inputRef.current?.focus();
              return;
            }
            if (!inputValue && selectedDate) {
              setInputValue(selectedDate.toString());
            }
            removeFocus();
            closeMenu();
          }}
          onFocus={() => {
            if (disabled) {
              return;
            }
            setFocus();
          }}
          value={inputValue}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            const { code, ctrlKey } = e;

            switch (code) {
              case "ArrowUp":
              case "ArrowDown":
                e.preventDefault();
                if (!show) {
                  setShow(true);
                  break;
                }
                break;
              case "Space":
                if (ctrlKey) {
                  e.preventDefault();
                  if (show) {
                    setShow(false);
                  } else {
                    setShow(true);
                  }
                }
                break;
              case "Escape":
                e.preventDefault();
                closeMenu();
                break;
              default:
                break;
            }
          }}
          placeholder={placeholder}
        />
        {/* Suffix -- clear and dropdown icon */}

        {suffix?.({
          onClear: clear,
          isOpen: show || !!open,
          showclear,
        }) || (
          <div
            tabIndex={-1}
            className="flex flex-row items-center gap-2 h-full text-inherit"
          >
            {showclear && !disabled && !!inputValue && (
              <button
                aria-label="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                tabIndex={-1}
                className="cursor-pointer outline-none border-0 opacity-80 hover:opacity-100 transition-all bg-transparent flex items-center justify-center text-inherit"
                type="button"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      <Menu
        lang={lang}
        portalRef={portalRef}
        show={show}
        bounds={bounds}
        today={today}
        selectedDate={selectedDate}
        onChange={(e) => {
          setSelectedDate(e);
          // @ts-ignore
          onChange?.(e);
          closeMenu();
        }}
        menuContainerClassName={menuContainerClassName}
        portalClassName={portalClassName}
        calendarClassName={calendarClassName}
        components={components}
        type={type}
        converterMode={converterMode}
        max={max}
        min={min}
      />
    </div>
  );
};

export default NepaliDatePicker;
