import toast from "react-hot-toast";

export const notifyNoMovies = () => {
  toast.error("No movies found for your request.");
};

export const notifyError = () => {
  toast.error("Please enter your search query.");
};
