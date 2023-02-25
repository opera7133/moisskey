import { VideoType } from "@/types/note";

export default function Video({ data }: { data: VideoType }) {
  if (data.service === "youtube") {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${data.id}`}
        className="block w-full md:max-w-xl mx-auto aspect-video my-3"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    );
  } else if (data.service === "niconico") {
    return (
      <iframe
        allowFullScreen
        allow="autoplay"
        className="block w-full md:max-w-xl mx-auto aspect-video my-3"
        src={`https://embed.nicovideo.jp/watch/${data.id}?persistence=1&amp;from=0&amp;allowProgrammaticFullScreen=1`}
      ></iframe>
    );
  } else {
    return (
      <iframe
        src={`//player.bilibili.com/player.html?bvid=${data.id}&page=1`}
        className="block w-full md:max-w-xl mx-auto aspect-video my-3"
        allowFullScreen
      ></iframe>
    );
  }
}
