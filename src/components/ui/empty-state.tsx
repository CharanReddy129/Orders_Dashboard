import * as React from "react";
import { cn } from "@/utils/helpers";

export function EmptyState({ icon: Icon, title, description, action, className }: { icon?: React.ElementType; title: string; description: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center", className)}>
      {Icon ? (
        <div className="mb-4 rounded-2xl bg-accent p-3 text-primary">
          <Icon className="size-6" />
        </div>
      ) : null}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
