export default function Button({
  children,
  className = "",
  ...props
}: any) {
  return (
    <button
      className={`
        w-full
        bg-green-700
        hover:bg-green-600
        text-white
        font-semibold
        py-3
        rounded-xl
        transition
        shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}