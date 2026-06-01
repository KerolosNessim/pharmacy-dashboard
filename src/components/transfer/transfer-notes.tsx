/** Renders transfer notes under medications when present. */
export function TransferNotes({ notes }: { notes?: string | null }) {
  const text = notes?.trim();
  if (!text) return null;

  return (
    <div className="flex flex-col gap-1 pt-1">
      <p className="text-base text-muted-foreground font-semibold">Notes:</p>
      <p className="text-sm p-2 bg-background/50 rounded whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
