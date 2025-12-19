import { useMemo, useState } from "react";
import { getAllIconNames, getIcon, type IconType, type IconName } from "@/icons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ColorIconPickerProps {
  onIconSelect?: (payload: { type: IconType; name: IconName }) => void;
  onColorChange?: (color: string) => void;
}

const ICON_NAME_CACHE = getAllIconNames();

export const ColorIconPicker: React.FC<ColorIconPickerProps> = ({
  onIconSelect,
  onColorChange,
}) => {
  const [activeTab, setActiveTab] = useState<IconType>("solid");
  const [search, setSearch] = useState("");
  const [color, setColor] = useState<string>("#4f46e5");

  const icons = useMemo(() => {
    const list = activeTab === "solid" ? ICON_NAME_CACHE.solid : ICON_NAME_CACHE.outline;
    if (!search.trim()) return list;
    const lower = search.toLowerCase();
    return list.filter((name) => name.toLowerCase().includes(lower));
  }, [activeTab, search]);

  return (
    <div className="mt-2 space-y-3 border-t pt-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">Icon &amp; Color</span>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onColorChange?.(e.target.value);
            }}
            className="h-5 w-5 cursor-pointer rounded border bg-transparent p-0"
          />
        </label>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as IconType)}
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
          {icons.map((name) => {
            const IconComp = getIcon(activeTab, name);
            if (!IconComp) return null;
            return (
              <button
                key={`${activeTab}-${name}`}
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent"
                onClick={() => {
                  // For now, just log and propagate selection
                  // Consumers can decide how to persist this later
                  // eslint-disable-next-line no-console
                  console.log("Selected icon:", { type: activeTab, name });
                  onIconSelect?.({ type: activeTab, name });
                }}
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
