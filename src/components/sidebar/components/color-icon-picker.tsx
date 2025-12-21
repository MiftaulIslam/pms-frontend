import { useMemo, useState, useEffect } from "react";
import { getAllIconNames, getIcon, type IconType, type IconName } from "@/icons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ColorIconPickerProps {
  onIconSelect?: (payload: { type: IconType; name: IconName }) => void;
  onColorChange?: (color: string) => void;
  onIconTypeChange?: (type: IconType) => void;
  currentIconType?: IconType;
  currentIcon?: string;
  currentColor?: string;
}

const ICON_NAME_CACHE = getAllIconNames();

// Default color palette (6-8 hex colors)
const DEFAULT_COLORS = [
  '#60A5FA', // Blue (default)
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-7 w-7 p-0 rounded-full"
        >
          <span
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: value }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-2">
        <div className="grid grid-cols-5 gap-2">
          {DEFAULT_COLORS.map((color: string) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={cn(
                'h-6 w-6 rounded-full border flex items-center justify-center',
                value === color && 'ring-2 ring-primary'
              )}
              style={{ backgroundColor: color }}
            >
              {value === color && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
export const ColorIconPicker: React.FC<ColorIconPickerProps> = ({
  onIconSelect,
  onColorChange,
  onIconTypeChange,
  currentIconType = "solid",
  currentIcon,
  currentColor = "#60A5FA",
}) => {
  const [activeTab, setActiveTab] = useState<IconType>(currentIconType);
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(currentColor || "#60A5FA");

  // Update selected color when currentColor prop changes
  useEffect(() => {
    if (currentColor) {
      setSelectedColor(currentColor);
    }
  }, [currentColor]);

  const icons = useMemo(() => {
    const list = activeTab === "solid" ? ICON_NAME_CACHE.solid : ICON_NAME_CACHE.outline;
    if (!search.trim()) return list;
    const lower = search.toLowerCase();
    return list.filter((name: string) => name.toLowerCase().includes(lower));
  }, [activeTab, search]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleIconSelect = (name: IconName) => {
    onIconSelect?.({ type: activeTab, name });
  };


  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs inline text-muted-foreground">Color &amp; Icon</p>
        {/* <div className="flex items-center gap-2">
          <Select value={selectedColor} onValueChange={handleColorSelect}>
            <SelectTrigger className="h-7 w-20 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded border"
                  style={{ backgroundColor: selectedColor }}
                />
                <SelectValue>
                  {getColorName(selectedColor)}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <span>{getColorName(color)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <ColorPicker
          value={selectedColor}
          onChange={handleColorSelect}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          const newTab = v as IconType;
          setActiveTab(newTab);
          // When tab changes, immediately update iconType
          onIconTypeChange?.(newTab);
        }}
        className="space-y-2"
      >
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger value="solid" className="text-xs">
            Solid
          </TabsTrigger>
          <TabsTrigger value="outline" className="text-xs">
            Outline
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Input
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 text-xs"
      />

      <div className="max-h-56 overflow-y-auto rounded-md border bg-background p-1">
        <div className="grid grid-cols-8 gap-1">
          {icons.map((name: IconName) => {
            const IconComp = getIcon(activeTab, name);
            if (!IconComp) return null;
            return (
              <button
                key={`${activeTab}-${name}`}
                type="button"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded hover:bg-accent transition-all",
                  currentIcon === name && currentIconType === activeTab && "bg-accent ring-2 ring-primary"
                )}
                onClick={() => handleIconSelect(name)}
              >
                <IconComp className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
