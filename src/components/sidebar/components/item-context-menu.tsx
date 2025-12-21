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
import { useUpdateIconColor } from "../hooks/use-update-icon-color";
import { useDuplicateEntity } from "../hooks/use-duplicate-entity";
import type { IconType } from "../types/playground-types";
import { CircleStack, ClipboardDocument, DocumentText, Folder, ListBullet } from "@/icons/outline";

export type SidebarItemKind = "collection" | "folder" | "item";

export interface ItemContextMenuProps {
  kind: SidebarItemKind;
  title: string;
  itemId?: string;
  currentIconType?: IconType;
  currentIcon?: string;
  currentColor?: string;
  onCreateFolder?: () => void;
  onCreateList?: () => void;
  onCreateDoc?: () => void;
  onCreateWhiteboard?: () => void;
  onCreateErd?: () => void;
  onMove?: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export const ItemContextMenu: FC<ItemContextMenuProps> = ({
  kind,
  itemId,
  currentIconType = "solid",
  currentIcon,
  currentColor = "#60A5FA",
  onCreateFolder,
  onCreateList,
  onCreateDoc,
  onCreateWhiteboard,
  onCreateErd,
  onMove,
  onDelete,
  onDuplicate,
}) => {
  const isContainer = kind !== "item";
  const { updateCollection, updateFolder, updateItem } = useUpdateIconColor();
  const { duplicateCollection, duplicateFolder, duplicateItem } = useDuplicateEntity();

  const handleDuplicate = async () => {
    if (!itemId) return;

    try {
      if (kind === "collection") {
        await duplicateCollection(itemId);
      } else if (kind === "folder") {
        await duplicateFolder(itemId);
      } else {
        await duplicateItem(itemId);
      }
      onDuplicate?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleIconSelect = async ({ type, name }: { type: IconType; name: string }) => {
    if (!itemId) return;

    try {
      const updateData: { iconType: IconType; icon: string; iconColor?: string } = {
        iconType: type,
        icon: name,
      };
      // Include current color to maintain it
      if (currentColor) {
        updateData.iconColor = currentColor;
      }

      if (kind === "collection") {
        await updateCollection({ collectionId: itemId, ...updateData });
      } else if (kind === "folder") {
        await updateFolder({ folderId: itemId, ...updateData });
      } else {
        await updateItem({ itemId, ...updateData });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleIconTypeChange = async (type: IconType) => {
    if (!itemId || !currentIcon) return;

    try {
      const updateData: { iconType: IconType; icon: string; iconColor?: string } = {
        iconType: type,
        icon: currentIcon,
      };
      if (currentColor) {
        updateData.iconColor = currentColor;
      }

      if (kind === "collection") {
        await updateCollection({ collectionId: itemId, ...updateData });
      } else if (kind === "folder") {
        await updateFolder({ folderId: itemId, ...updateData });
      } else {
        await updateItem({ itemId, ...updateData });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleColorChange = async (color: string) => {
    if (!itemId) return;

    try {
      if (kind === "collection") {
        await updateCollection({ collectionId: itemId, iconColor: color });
      } else if (kind === "folder") {
        await updateFolder({ folderId: itemId, iconColor: color });
      } else {
        await updateItem({ itemId, iconColor: color });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

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
            <DropdownMenuSubContent className="space-y-1">
              {kind === "collection" && onCreateFolder && (
                <DropdownMenuItem onClick={onCreateFolder}>
                  <div className="flex items-start gap-2 cursor-pointer">
                    <Folder className="size-5 text-muted-foreground" />
                    <p className="pt-1">
                      <span className="text-sm font-medium block">Folder</span>
                      <span className="text-xs text-muted-foreground">
                        Create a new folder to organize your projects
                      </span>
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onCreateList && (
                <DropdownMenuItem onClick={onCreateList}>
                  <div className="flex items-start gap-2 cursor-pointer">
                    <ListBullet className="size-5 text-muted-foreground" />
                    <p className="pt-1">
                      <span className="text-sm font-medium block">List</span>
                      <span className="text-xs text-muted-foreground">
                        Track tasks, ideas, and more
                      </span>
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              {onCreateWhiteboard && (
                <DropdownMenuItem onClick={onCreateWhiteboard}>

                  <div className="flex items-start gap-2 cursor-pointer">
                    <ClipboardDocument className="size-5 text-muted-foreground" />
                    <p>
                      <span className="text-sm font-medium block">Whiteboard</span>
                      <span className="text-xs text-muted-foreground">
                        Collaborate with your team on ideas and plans
                      </span>
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              {onCreateDoc && (
                <DropdownMenuItem onClick={onCreateDoc}>
                  <div className="flex items-start gap-2 cursor-pointer">
                    <DocumentText className="size-5 text-muted-foreground" />
                    <p>
                      <span className="text-sm font-medium block">Doc</span>
                      <span className="text-xs text-muted-foreground">
                        Share files, images, and more
                      </span>
                    </p>
                  </div>
                </DropdownMenuItem>
              )}

              {onCreateErd && (
                <DropdownMenuItem onClick={onCreateErd}>
                  <div className="flex items-start gap-2 cursor-pointer">
                    <CircleStack className="size-5 text-muted-foreground" />
                    <p>
                      <span className="text-sm font-medium block">ERD</span>
                      <span className="text-xs text-muted-foreground">
                        Visualize your database schema
                      </span>
                    </p>
                  </div>
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
            currentIconType={currentIconType}
            currentIcon={currentIcon}
            currentColor={currentColor}
            onIconSelect={handleIconSelect}
            onColorChange={handleColorChange}
            onIconTypeChange={handleIconTypeChange}
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
      <DropdownMenuItem onClick={handleDuplicate}>
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
