"use client";
import React, { createRef, useRef, useEffect, useState } from "react";
import { TWatchedAnime } from "@/@types/AnimeType";
import EpisodeDisplay from "../components/EpisodeDisplay";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Episode, IAnime } from "@/@types/EnimeType";

type EpisodeLayoutProps = {
  animeInfo: IAnime;
  episode: Episode;
};

function EpisodeLayout({ animeInfo, episode }: EpisodeLayoutProps) {
  const { setKitsuneWatched, getKitsuneWatchedId } = useLocalStorage();
  const curRef = useRef<null | HTMLDivElement>(null);
  const [watched, setWatched] = useState<TWatchedAnime | null>(null);
  let refs = animeInfo.episodes.reduce((acc: any, value) => {
    acc[value.number] = createRef();
    return acc;
  }, {});

  useEffect(() => {
    if (animeInfo.episodes.length <= 0) return;
    setWatched(getKitsuneWatchedId(animeInfo.slug));
    setKitsuneWatched({
      id: animeInfo.slug,
      title: animeInfo.title.romaji,
      image: animeInfo.coverImage,
      ep: {
        id: episode.id,
        number: episode.number,
      },
    });
  }, []);

  const onSearch = (e: any) => {
    e.preventDefault();
    let ep = Number(e.target.value);
    if (ep <= 0) return;
    if (!refs[ep]) return;
    curRef.current = refs[ep].current;
    if (curRef.current) {
      curRef.current.scrollIntoView();
    }
  };

  return (
    <div className="flex flex-col gap-5 mb-10 mt-10 ml-3 mr-3 lg:ml-0 lg:mr-0 lg:m-10 lg:mb-5 ">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center gap-5 order-2 lg:order-1 w-full lg:w-1/2">
          <p className="text-2xl uppercase font-bold">Episodes</p>
          <input
            type="text"
            className="input input-sm w-full"
            placeholder="Search"
            onChange={onSearch}
          />
        </div>
        <div className="flex items-center justify-end gap-2 w-full lg:w-1/2 order-1 lg:order-2 mb-5 lg:mb-0">
          <p className="text-sm text-gray-400">Provider</p>
          <select
            className="select select-bordered w-full lg:w-[400px] max-w-xs select-sm"
            onChange={(e) => {
              localStorage.setItem("provider", e.target.value);
              window.location.reload();
            }}
            value={
              typeof window !== "undefined"
                ? localStorage.getItem("provider") ?? "Gogo"
                : ""
            }
          >
            <option value="Gogo">Gogo</option>
            <option value="Zoro">Zoro</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 max-h-[90vh] overflow-y-auto">
        {animeInfo.episodes.length > 0 ? (
          animeInfo.episodes.map((ep: Episode, index: number) => (
            <div
              key={index}
              className={"w-full lg:w-[320px]"}
              ref={refs[ep.number]}
            >
              <a href={`/anime/${animeInfo.slug}/watch?ep=${ep.id}`}>
                <EpisodeDisplay
                  ep={ep}
                  backSrc={animeInfo.coverImage}
                  isCurrent={episode.id === ep.id}
                  watched={
                    watched
                      ? watched.ep.some(
                        (e: { id: string; number: number }) => e.id === ep.id
                      )
                      : false
                  }
                />
              </a>
            </div>
          ))
        ) : (
          <div className="w-full h-[150px] flex items-center justify-center">
            <p className="font-bold uppercase text-gray-400">No Episodes</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EpisodeLayout;
