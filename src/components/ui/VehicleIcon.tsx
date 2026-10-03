export function VehicleIcon({ type }: { type: "truck" | "van" | "train" | "warehouse" }) {
  if (type === "warehouse") {
    return (
      <svg viewBox="0 0 160 90" aria-hidden="true">
        <path d="m12 29 68-23 68 23v53H12Z" fill="#eceeec" />
        <path d="M12 29 80 6l68 23v10H12Z" fill="#e21d2b" />
        <path d="M23 43h114v39H23Z" fill="#f8f8f6" />
        <path d="M30 49h26v33H30zm37 0h26v33H67zm37 0h26v33h-26Z" fill="#c9cdcc" />
        <path d="M10 82h140" stroke="#9da2a1" strokeWidth="3" />
      </svg>
    );
  }
  if (type === "train") {
    return (
      <svg viewBox="0 0 160 90" aria-hidden="true">
        <path d="M22 22h105c8 0 14 7 14 15v31H22Z" fill="#e21d2b" />
        <path d="M34 32h26v21H34zm36 0h26v21H70zm36 0h21v21h-21Z" fill="#f4f4f1" />
        <path d="M22 64h119v8H22Z" fill="#777d7e" />
        <circle cx="43" cy="75" r="7" fill="#35393b" /><circle cx="117" cy="75" r="7" fill="#35393b" />
        <path d="M14 84h134" stroke="#a9adac" strokeWidth="3" />
      </svg>
    );
  }
  if (type === "van") {
    return (
      <svg viewBox="0 0 160 90" aria-hidden="true">
        <path d="M17 24h83v43H17Z" fill="#e21d2b" />
        <path d="M100 38h22l22 19v10h-44Z" fill="#d92730" />
        <path d="M106 43h13l15 13h-28Z" fill="#dce6e7" />
        <circle cx="46" cy="68" r="10" fill="#303537" /><circle cx="120" cy="68" r="10" fill="#303537" />
        <circle cx="46" cy="68" r="4" fill="#c7cbca" /><circle cx="120" cy="68" r="4" fill="#c7cbca" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 90" aria-hidden="true">
      <path d="M8 23h91v44H8Z" fill="#e21d2b" />
      <path d="M99 36h26l23 20v11H99Z" fill="#ce1925" />
      <path d="M106 42h16l14 13h-30Z" fill="#dce6e7" />
      <path d="M20 31h66v6H20Z" fill="#fff" opacity=".86" />
      <circle cx="40" cy="69" r="11" fill="#303537" /><circle cx="122" cy="69" r="11" fill="#303537" />
      <circle cx="40" cy="69" r="4" fill="#c7cbca" /><circle cx="122" cy="69" r="4" fill="#c7cbca" />
    </svg>
  );
}
