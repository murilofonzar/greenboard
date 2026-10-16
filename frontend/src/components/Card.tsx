export default function Card({ children }: any) {
  return (
    <div
      className="
        bg-black/40
        backdrop-blur-md
        border
        border-white/10
        rounded-2xl
        p-6
        shadow-2xl
      "
    >
      {children}
    </div>
  );
}