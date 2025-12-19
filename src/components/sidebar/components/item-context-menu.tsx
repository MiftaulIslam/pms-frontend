import type { FC } from "react";
import {
  Archive,
  Link2,
  MoveRight,
  Palette,
  Pencil,
  Plus,
  Repeat2,
  Trash2,
} from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorIconPicker } from "./color-icon-picker";

export type SidebarItemKind = "collection" | "folder" | "item";

export interface ItemContextMenuProps {
  kind: SidebarItemKind;
  title: string;
  onCreateFolder?: () => void;
  onCreateList?: () => void;
  onCreateDoc?: () => void;
  onCreateWhiteboard?: () => void;
  onCreateErd?: () => void;
  onMove?: () => void;
  onDelete: () => void;
}

export const ItemContextMenu: FC<ItemContextMenuProps> = ({
  kind,
  title,
  onCreateFolder,
  onCreateList,
  onCreateDoc,
  onCreateWhiteboard,
  onCreateErd,
  onMove,
  onDelete,
}) => {
  const isContainer = kind !== "item";

  return (
    <>
      {/* Rename / Copy link */}
      <DropdownMenuItem>
        <Pencil className="mr-2 text-muted-foreground" />
        <span>Rename</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link2 className="mr-2 text-muted-foreground" />
        <span>Copy link</span>
      </DropdownMenuItem>

      {/* Create new submenu for collections/folders */}
      {isContainer && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Plus className="mr-2 text-muted-foreground" />
              <span>Create new</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44 space-y-1">
              {kind === "collection" && onCreateFolder && (
                <DropdownMenuItem onClick={onCreateFolder}>
                  <span>Folder</span>
                </DropdownMenuItem>
              )}
              {onCreateList && (
                <DropdownMenuItem onClick={onCreateList}>
                  <span>List</span>
                </DropdownMenuItem>
              )}
              {onCreateDoc && (
                <DropdownMenuItem onClick={onCreateDoc}>
                  <span>Doc</span>
                </DropdownMenuItem>
              )}
              {onCreateWhiteboard && (
                <DropdownMenuItem onClick={onCreateWhiteboard}>
                  <span>Whiteboard</span>
                </DropdownMenuItem>
              )}
              {onCreateErd && (
                <DropdownMenuItem onClick={onCreateErd}>
                  <span>ERD</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </>
      )}

      {/* Color & Icon submenu */}
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Palette className="mr-2 text-muted-foreground" />
          <span>Color &amp; Icon</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-72 p-2 space-y-2">
          <ColorIconPicker
            onIconSelect={({ type, name }) =>
              console.log("Sidebar icon selected", { item: title, type, name })
            }
            onColorChange={(color) =>
              console.log("Sidebar color selected", { item: title, color })
            }
          />
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      {/* Item-only action */}
      {kind === "item" && onMove && (
        <DropdownMenuItem onClick={onMove}>
          <MoveRight className="mr-2 text-muted-foreground" />
          <span>Move</span>
        </DropdownMenuItem>
      )}

      <DropdownMenuSeparator />

      {/* Duplicate / Archive / Delete */}
      <DropdownMenuItem>
        <Repeat2 className="mr-2 text-muted-foreground" />
        <span>Duplicate</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Archive className="mr-2 text-muted-foreground" />
        <span>Archive</span>
      </DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onClick={onDelete}>
        <Trash2 className="mr-2 text-muted-foreground" />
        <span>
          Delete
          {kind === "collection"
            ? " Collection"
            : kind === "folder"
            ? " Folder"
            : " Item"}
        </span>
      </DropdownMenuItem>
    </>
  );
};
