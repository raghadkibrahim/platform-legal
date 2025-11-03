import { useEffect } from "react";

export default function Flash({ message, onClear }: { message: string | null; onClear: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClear, 3000);
    return () => clearTimeout(t);
  }, [message, onClear]);

  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}
