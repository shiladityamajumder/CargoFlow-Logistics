export function ServiceGlyph({ type }: { type: "truck" | "warehouse" | "plane" | "train" | "package" }) {
  const paths = {
    truck: "M3 4h12v12H3zM15 9h3l3 4v3h-6M5 16v3m12-3v3M5 7h8M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4m11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
    warehouse: "M3 10l9-6 9 6v11H3zM8 21v-9h8v9M2 10h20M8 15h8M8 18h8",
    plane: "M12 2v20M3 15l9-6 9 6M7 21l5-3 5 3",
    train: "M6 3h12v14H6zM8 3V1m8 2V1M8 8h8M8 12h8M8 17l-3 5m11-5 3 5M5 20h14",
    package: "M3 7l9-5 9 5v11l-9 5-9-5zM3 7l9 5 9-5M12 12v11M7 4l10 6"
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}
