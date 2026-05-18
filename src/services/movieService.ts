import axios from "axios";
import { type Movie } from "../types/movie";

interface MovieServiceProps {
  page: number;
  results: Movie[];
  total_pages: number;
}

const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const movieService = async (
  isSearch: string,
  isPage: number
): Promise<MovieServiceProps> => {
  const { data } = await api.get<MovieServiceProps>("/search/movie", {
    params: {
      query: isSearch,
      page: isPage,
      include_adult: false,
      language: "en-US",
    },
  });
  return data;
};