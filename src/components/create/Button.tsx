export default function Button({
  text,
  onClick,
}: {
  text: string;
  onClick?: any;
}) {
  return (
    <button
      className="py-0.5 px-1 bg-gray-200 duration-100 hover:bg-gray-300 rounded text-sm"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
