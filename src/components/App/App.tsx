import "modern-normalize";
import css from "./App.module.css";
import { useState, useEffect } from "react";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import {movieService} from '../../services/movieService'
import { Toaster } from "react-hot-toast";
import { notifyNoMovies } from "../../services/toast";
export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isVideos, setIsVideos] = useState<Movie[]>([]);
  const [isSearch, setIsSearch] = useState("");
  const [isPage, setIsPage] = useState(1);
  useEffect(() => {
    if (!isSearch)return
    const api = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await movieService(isSearch, isPage);
        if (data.results.length === 0) {
          if (isPage === 1) notifyNoMovies();
          setIsVideos([]);
          return;
        }
        setIsVideos(data.results)
      } catch (e) {
        console.error(e);
        setIsError(true);
        setIsVideos([])
      }
      finally {setIsLoading(false)}
    };
    api();
  }, [isSearch, isPage]);
  const closeModal = () => {
    setIsModal(null);
  };
  return (
    <div className={css.app}>
      <SearchBar
        onSubmit={(q) => {
          setIsSearch(q);
          setIsPage(1);
          setIsVideos([]);
        }}
      />
      {!isLoading && !isError && isVideos.length > 0 && (
        <MovieGrid
          movies={isVideos}
          onSelect={(movie) => {
            setIsModal(movie);
          }}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModal && <MovieModal movie={isModal}
          onClose={closeModal} />}
          <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
