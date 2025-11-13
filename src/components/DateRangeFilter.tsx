import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { sr } from "date-fns/locale";

export type DateRangeType = "all" | "thisWeek" | "thisMonth" | "lastMonth" | "custom";

export interface DateRange {
  type: DateRangeType;
  from?: Date;
  to?: Date;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const presets: { type: DateRangeType; label: string }[] = [
    { type: "all", label: "Sve" },
    { type: "thisWeek", label: "Ova nedelja" },
    { type: "thisMonth", label: "Ovaj mesec" },
    { type: "lastMonth", label: "Prošli mesec" },
    { type: "custom", label: "Prilagođeno" },
  ];

  const handlePresetSelect = (type: DateRangeType) => {
    const today = new Date();
    
    switch (type) {
      case "all":
        onChange({ type: "all" });
        break;
      case "thisWeek":
        onChange({
          type: "thisWeek",
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        });
        break;
      case "thisMonth":
        onChange({
          type: "thisMonth",
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        onChange({
          type: "lastMonth",
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        });
        break;
      case "custom":
        setShowCalendar(true);
        break;
    }
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      onChange({
        type: "custom",
        from: customFrom,
        to: customTo,
      });
      setShowCalendar(false);
    }
  };

  const getButtonLabel = () => {
    if (value.type === "all") return "Sve transakcije";
    if (value.type === "custom" && value.from && value.to) {
      return `${format(value.from, "dd.MM.yyyy")} - ${format(value.to, "dd.MM.yyyy")}`;
    }
    const preset = presets.find(p => p.type === value.type);
    return preset?.label || "Izaberi period";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {getButtonLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        {!showCalendar ? (
          <div className="p-2">
            {presets.map((preset) => (
              <Button
                key={preset.type}
                variant={value.type === preset.type ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handlePresetSelect(preset.type)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Od:</p>
              <Calendar
                mode="single"
                selected={customFrom}
                onSelect={setCustomFrom}
                locale={sr}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Do:</p>
              <Calendar
                mode="single"
                selected={customTo}
                onSelect={setCustomTo}
                locale={sr}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCalendar(false)} className="flex-1">
                Nazad
              </Button>
              <Button 
                onClick={handleCustomApply} 
                disabled={!customFrom || !customTo}
                className="flex-1"
              >
                Primeni
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};