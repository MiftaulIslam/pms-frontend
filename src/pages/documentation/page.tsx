import type { FC } from "react";

const Documentation: FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Learn about the building blocks of the ProjectFlow board experience.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Drag &amp; Drop System</h2>
        <p className="text-muted-foreground">
          ProjectFlow uses a custom drag &amp; drop hook that powers card and column
          interactions across the board and list views. This hook is exposed as an
          internal utility and documented under the <code>/doc/dnd</code> route.
        </p>
        <p className="text-muted-foreground">
          Use the DnD documentation to understand how drag state is managed and how
          to integrate drag behaviour into new components.
        </p>
      </section>
    </div>
  );
};

export default Documentation;
