import type { FC } from "react";

const DocDnd: FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary uppercase tracking-wide">
          Internal API
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Drag &amp; Drop Hook</h1>
        <p className="text-muted-foreground">
          The <code>useDragAndDrop</code> hook is our reusable drag-and-drop engine
          used across boards, lists, and configuration UIs. You can think of it as a
          small internal package that exposes state and helper functions for
          managing drag interactions.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Import</h2>
        <pre className="bg-muted rounded-md p-4 text-sm overflow-x-auto">
{`import { useDragAndDrop } from "@/hooks/use-drag-and-drop";`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Core Concepts</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>
            <strong>DragItem</strong> – describes the item being dragged
            <code>({`{ id, columnId, index }`})</code>.
          </li>
          <li>
            <strong>DragState</strong> – central state that tracks whether we are
            dragging, which item is dragged, and where the current drop position is.
          </li>
          <li>
            <strong>Area-aware</strong> – <code>columnId</code> can be a real
            column ID (for cards) or a logical area ID like <code>"columns"</code>
            (for column reordering UIs).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">API Surface</h2>
        <p className="text-muted-foreground">
          Calling <code>useDragAndDrop()</code> returns an object with drag state
          and helper functions:
        </p>
        <pre className="bg-muted rounded-md p-4 text-sm overflow-x-auto">
{`const {
  dragState,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  getDragPreviewStyle,
  shouldShowDropIndicator,
} = useDragAndDrop();`}
        </pre>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            <strong>dragState</strong>: <code>{`{ isDragging, draggedItem, dragOverColumn, dragOverIndex }`}</code>
          </li>
          <li>
            <strong>handleDragStart(item, event)</strong>: call on
            <code>onMouseDown</code> of a draggable element to start dragging.
          </li>
          <li>
            <strong>handleDragEnd()</strong>: call when the drag finishes; this
            resets state and re-enables text selection.
          </li>
          <li>
            <strong>handleDragOver(columnId, index?)</strong>: call on
            <code>onMouseMove</code> over potential drop positions to update
            <code>dragOverColumn</code> and <code>dragOverIndex</code>.
          </li>
          <li>
            <strong>handleDragLeave()</strong>: clear the current
            <code>dragOver*</code> info when leaving a droppable area.
          </li>
          <li>
            <strong>getDragPreviewStyle(event)</strong>: helper to compute a
            fixed-position style for a custom drag preview element.
          </li>
          <li>
            <strong>shouldShowDropIndicator(columnId, index)</strong>: returns a
            boolean indicating whether a visual drop indicator should be rendered
            before/after a given item.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Basic Usage Pattern</h2>
        <p className="text-muted-foreground">
          A typical integration uses the hook to power drag behaviour and then
          applies domain-specific logic (moving cards, columns, etc.) when the
          drag ends. The hook itself is UI-agnostic and does not mutate your
          data structures.
        </p>
        <pre className="bg-muted rounded-md p-4 text-sm overflow-x-auto">
{`const {
  dragState,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  shouldShowDropIndicator,
} = useDragAndDrop();

// Example: when drag ends, use dragState to update your data
useEffect(() => {
  if (!dragState.isDragging && dragState.draggedItem && dragState.dragOverColumn !== null) {
    // Use dragState.draggedItem and dragState.dragOver* to move items
  }
}, [dragState]);`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How We Use It in Boards</h2>
        <p className="text-muted-foreground">
          In the main board (<code>Kanbanv2</code>) we use
          <code>useDragAndDrop</code> to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Track which card is currently being dragged.</li>
          <li>
            Compute per-column drop positions via <code>handleDragOver</code> and
            <code>shouldShowDropIndicator</code>.
          </li>
          <li>
            On drag end, call <code>moveCard</code> with the new column and index,
            using <code>dragState.dragOverColumn</code> and
            <code>dragState.dragOverIndex</code>.
          </li>
          <li>
            Render a custom floating preview (list or card view) based on
            <code>dragState.isDragging</code>.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How We Use It in Config UIs</h2>
        <p className="text-muted-foreground">
          The same hook is reused in configuration components such as the
          "Column DnD" sheet and list creation modal:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>
            Logical area ID (e.g. <code>"columns"</code>) is passed as
            <code>columnId</code> when starting a drag.
          </li>
          <li>
            <code>handleDragOver</code> is called as the user moves over rows to
            compute the target index.
          </li>
          <li>
            A finalize function reads <code>dragState</code> and reorders items in
            local state, without the hook knowing anything about columns or
            boards.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Design Principles</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>
            Treat <code>useDragAndDrop</code> as a small, reusable package: it
            only owns drag state and basic geometry, not domain logic.
          </li>
          <li>
            Consumers (boards, modals, sheets) are responsible for updating their
            own data models when drag completes.
          </li>
          <li>
            The hook is mouse-driven (using <code>onMouseDown</code> /
            <code>onMouseMove</code>) and doesn&apos;t rely on HTML5 drag events.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">When to Use This Hook</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>
            You need a drag-and-drop experience that feels the same as the main
            Kanban board.
          </li>
          <li>
            You want drag behaviour but prefer to keep your domain logic fully in
            the consuming component.
          </li>
          <li>
            You are reordering items in a list or grid and want consistent drop
            indicators.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default DocDnd;
