import { URLType } from "@/types/note";

export default function Embed({ data }: { data: URLType }) {
  return (
    <div className="flex gap-6 items-start px-3 text-sm relative border rounded-lg py-2 my-2 mx-2">
      <div className="w-full">
        <div>
          <div className="bg-gray-300 text-white inline-block px-1 py-0.5 rounded">
            リンク
          </div>
          <span className="ml-2 text-gray-400">{data.og?.siteName}</span>
        </div>
        <a
          href={data.url}
          rel="noopener noreferrer"
          target="_blank"
          className="duration-100 hover:text-lime-500 text-base"
        >
          <h3 className="font-bold py-2">{data.og?.title}</h3>
        </a>
        <p className="text-xs opacity-80 whitespace-pre-wrap">
          {data.og?.description}
        </p>
      </div>
      {data.og && data.og.image && (
        <img
          src={data.og?.image}
          className="h-32 border rounded aspect-square object-cover"
        />
      )}
    </div>
  );
}
