import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Check, Flag, Trash2, Users } from "lucide-react";
import { PRIORITY_COLOR } from "./priority";
import { useKanban } from "../../context";

export interface KanbanListComposerProps {
  //   title: string;
  //   onTitleChange: (v: string) => void;
  //   priority: "low" | "medium" | "high" | "none";
  //   onPriorityChange: (v: "low" | "medium" | "high" | "none") => void;
  //   onConfirm: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  col: any;
  setComposer: (composer: {
    open: boolean;
    position: "top" | "bottom";
  }) => void;
  position: "top" | "bottom";
  //   onCancel: () => void;
}

const KanbanListComposer: React.FC<KanbanListComposerProps> = ({
  //   title,
  //   onTitleChange,
  //   priority,
  //   onPriorityChange,
  //   onConfirm,
  col,
  setComposer,
  position,
  //   onCancel,
}) => {
  const { createTask: createTaskAction } = useKanban();
  const [newTitle, setNewTitle] = React.useState("");
  const [newPriority, setNewPriority] = React.useState<
    "low" | "medium" | "high" | "none"
  >("none");
  console.log(newPriority);
  return (
    <div className="grid grid-cols-[1fr_1fr_160px_140px_40px] items-center gap-2 px-4 py-2 border-b bg-background/40">
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task title"
          className="h-7 max-w-[520px] rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex items-center gap-1">
        <Select
          value={newPriority}
          onValueChange={(v) => setNewPriority(v as "low" | "medium" | "high" | "none" )}
        >
          <SelectTrigger
            className="h-7 w-[90px] px-0 rounded-none border-0
                        outline-none focus:outline-none
                        ring-0 ring-offset-0
                        focus:ring-0 focus:ring-offset-0
                        focus-visible:ring-0! focus-visible:ring-offset-0!
                        data-[state=open]:ring-0! data-[state=open]:ring-offset-0!
                        shadow-none focus:shadow-none"
          >
            {newPriority === "none" ? (
              <Flag className="w-4 h-4 mx-auto text-gray-500" />
            ) : (
              <SelectValue />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" textValue="Low">
              <p className="flex items-center gap-2">
                <Flag className={`w-4 h-4 ${PRIORITY_COLOR.low}`} />{" "}
                <span className="text-xs">Low</span>
              </p>
            </SelectItem>
            <SelectItem value="medium" textValue="Medium">
              <p className="flex items-center gap-2">
                <Flag className={`w-4 h-4 ${PRIORITY_COLOR.medium}`} />{" "}
                <span className="text-xs">Medium</span>
              </p>
            </SelectItem>
            <SelectItem value="high" textValue="High">
              <p className="flex items-center gap-2">
                <Flag className={`w-4 h-4 ${PRIORITY_COLOR.high}`} />{" "}
                <span className="text-xs">High</span>
              </p>
            </SelectItem>
            <SelectItem value="urgent" textValue="Urgent">
              <p className="flex items-center gap-2">
                <Flag className={`w-4 h-4 ${PRIORITY_COLOR.urgent}`} />{" "}
                <span className="text-xs">Urgent</span>
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Calendar className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Users className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (!newTitle.trim()) return;
            createTaskAction(
              col.id,
              newTitle.trim(),
              undefined,
              newPriority === "none" ? undefined : (newPriority as 'low' | 'medium' | 'high'),
              position
            );
            setComposer({ open: false, position: "bottom" });
            setNewTitle("");
            setNewPriority("none");
          }}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => {
            setComposer({ open: false, position: "bottom" });
            setNewTitle("");
            setNewPriority("none");
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">—</div>
      <div></div>
    </div>
  );
};

export default KanbanListComposer;
