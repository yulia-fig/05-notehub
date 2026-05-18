import "modern-normalize";
import css from "./App.module.css";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { movieService } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import { notifyNoMovies } from "../../services/toast";
import Paginate from "../ReactPaginate/ReactPaginate";
export default function App() {
  const [isModal, setIsModal] = useState<Movie | null>(null);

  const [isVideos, setIsVideos] = useState<Movie[]>([]);
  const [isSearch, setIsSearch] = useState("");
  const [isPage, setIsPage] = useState(1);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["myVideoKey", isSearch, isPage],
    queryFn: () => movieService(isSearch, isPage),
    enabled: isSearch !== "", // якщо пошукове поле для вводу пусте, запит не робиться
    placeholderData: keepPreviousData,
  });

  const closeModal = () => {
    setIsModal(null);
  };

  const results = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  useEffect(() => {
    if (data?.results && data.results.length === 0) {
      notifyNoMovies();
    }
  }, [data]);
  return (
    <div className={css.app}>
      <SearchBar
        onSubmit={(q) => {
          setIsSearch(q);
          setIsPage(1);
          setIsVideos([]);
        }}
      />
      {isSuccess && totalPages > 1 && (
        <Paginate
          totalPages={totalPages}
          currentPage={isPage}
          onPageChange={setIsPage}
        />
      )}
      {!isLoading && !isError && results.length > 0 && (
        <MovieGrid
          movies={data?.results || []}
          onSelect={(movie) => {
            setIsModal(movie);
          }}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModal && <MovieModal movie={isModal} onClose={closeModal} />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
