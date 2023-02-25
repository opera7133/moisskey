import { ImageType } from "@/types/note";

export default function MImage({ data }: { data: ImageType }) {
  return (
    <div className="flex pl-2 text-sm relative">
      <div className="w-full">
        <a
          href={data.quote}
          target="_blank"
          rel="noopener noreferrer"
          className="duration-100 hover:text-lime-500 text-lg"
        >
          <h3 className="font-bold pt-2">{data.title}</h3>
        </a>
        <div className="py-4 w-full flex items-start gap-4">
          <a href={data.quote} target="_blank" rel="noopener noreferrer">
            <img
              src={data.url}
              className="max-w-xs"
              alt={data.alt}
              referrerPolicy="no-referrer"
            />
          </a>
          <p className="text-xs text-gray-600 opacity-80 whitespace-pre-wrap">
            {data.alt}
          </p>
        </div>
      </div>
    </div>
  );
}
