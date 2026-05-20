import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
interface NoteListProps {
  movies: Note[];
  
}
export default function NoteList({ movies }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };
  return (
    <ul className={css.list}>
      {movies.map((movie) => (
        <li
          className={css.listItem}
          key={movie.id}
        >
          <h2 className={css.title}>{movie.title}</h2>
          <p className={css.content}>{movie.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{movie.tag}</span>
            <button className={css.button} onClick={() => handleDelete(movie.id)}
              disabled={mutation.isPending}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
