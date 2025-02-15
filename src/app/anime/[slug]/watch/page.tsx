import useAnime from "@/hooks/useAnime";
import React from "react";
import { Episode, IAnime, ITmdbImage } from "@/@types/EnimeType";
import useTMDB from "@/hooks/useTMDB";
import { Metadata } from "next";
import parse from "html-react-parser";
import EpisodeFrame from "./partial/EpisodeFrame";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug;
  const { getInfo } = useAnime();
  const info: IAnime = await getInfo(id);

  return {
    title: "Kitsune | " + info.title.romaji,
    openGraph: {
      title: "Watch " + info.title.romaji + " free with no Ads on Kitsune",
      images: [info.coverImage, info.bannerImage],
    },
  };
}

async function page({ params, searchParams }: Props) {
  const { getInfo } = useAnime();
  const { getTMDBMap } = useTMDB();
  let animeInfo: IAnime = await getInfo(params.slug);
  const tmdbLogo: { result: ITmdbImage } = await getTMDBMap(
    animeInfo.title.romaji
  );

  let episode = searchParams.ep
    ? animeInfo.episodes?.filter((ep: Episode) => ep.id === searchParams.ep)[0]
    : animeInfo.episodes[0];

  const random = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative w-full">
        <img
          src={
            animeInfo.bannerImage ??
            "https://image.tmdb.org/t/p/original" +
            random(tmdbLogo.result.backdrops).file_path
          }
          className="lg:h-[500px] h-[200px] w-full opacity-50 object-cover"
        />
        {tmdbLogo.result?.logos.length > 0 && (
          <div className="absolute flex item-center justify-center top-1/4 lg:top-1/3 lg:right-20 lg:left-auto left-1/3 space-x-5">
            <img
              src={
                "https://image.tmdb.org/t/p/w500" +
                random(tmdbLogo.result.logos).file_path
              }
              className="lg:h-[250px] lg:w-[500px] w-[250px] h-[150px]"
            />
          </div>
        )}
      </div>
      <div className="lg:flex mt-2 lg:mt-0">
        {/*Episode Panel*/}
        <div className="flex-1">
          <div className="flex-col">
            <EpisodeFrame episode={episode} animeInfo={animeInfo} />
          </div>
        </div>
        {/*Information Panel*/}
        <div className="relative lg:right-0 lg:w-1/4">
          <div
            className={`p-5 h-[90vh] lg:h-full w-full`}
            style={{
              backgroundImage: `url(${animeInfo.coverImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              filter: "blur(20px)",
              WebkitFilter: "blur(20px)",
            }}
          ></div>
          <div
            className={`absolute top-0 p-5 h-[90vh] lg:h-full w-full bg-gray-700 opacity-20`}
          ></div>
          <div className="absolute top-0 m-5 flex flex-col gap-5">
            <div className="flex lg:flex-row flex-col gap-3">
              <img
                src={animeInfo.coverImage}
                className="rounded-lg object-cover w-[150px] max-h-[200px]"
              />
            </div>
            <div>
              <p className="font-bold text-xl">{animeInfo.title.romaji}</p>
              <p>{animeInfo.synonyms}</p>
              <div>
                Genre:
                {animeInfo.genre.map((genre: string, index: number) => (
                  <div
                    className="badge badge-primary mr-1 ml-1 text-primary-content"
                    key={index}
                  >
                    {genre}
                  </div>
                ))}
              </div>
              <p>Status: {animeInfo.status}</p>
              <p>Released: {animeInfo.year}</p>
              <p>Episodes: {animeInfo.season}</p>
            </div>
            <div>
              <div className="max-h-[35vh] lg:max-h-full overflow-y-auto">
                {parse(animeInfo.description)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
