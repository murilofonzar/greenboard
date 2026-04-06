import { useEffect, useState } from "react";

export default function Home({ onStart }: any) {
  const [text, setText] = useState("");
  const full = "Greenboard";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(interval);
    }, 120);

    setTimeout(() => onStart(), 2000);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-5xl chalk">{text}</h1>
    </div>
  );
}