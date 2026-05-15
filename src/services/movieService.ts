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
  console.log(isSearch);
  console.log(isPage);
  axios.get(`https://notehub-public.goit.study/api`);
  const { data } = await api.get<MovieServiceProps>("/search/movie", {
    params: {
      isSearch,
      isPage,
      include_adult: false,
      language: "en-US",
    },
  });
  console.log(data);
  return data;
};