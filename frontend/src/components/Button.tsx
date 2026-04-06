export default function Button({ children, ...props }: any) {
  <div className="bg-red-500 text-white p-10">
  TESTE TAILWIND
</div>
  return (
    <button
      className="
        bg-white/90 
        hover:bg-white 
        text-black 
        px-4 py-2 
        rounded-xl 
        shadow-md 
        transition 
        hover:scale-105
        w-full
      "
      {...props}
    >
      {children}
    </button>
  );
}