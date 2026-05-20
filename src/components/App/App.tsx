import "modern-normalize";
import css from "./App.module.css";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";

import { fetchNotes } from "../../services/noteService";
import { Toaster } from "react-hot-toast";
import { notifyNoMovies } from "../../services/toast";
import Paginate from "../Pagination/Pagination";
import { useDebouncedCallback } from 'use-debounce';
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm"
export default function App() {
  const [createNoteThis, setCreateNoteThis] = useState(false);
  const [input, setInput] = useState("");

  const [isSearch, setIsSearch] = useState("");
  const [page, setPage] = useState(1);

const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", page, isSearch],
    queryFn: () =>
      fetchNotes({
        page,
        search: isSearch || undefined,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });
 const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setIsSearch(value);
  }, 500);
  const closeModal = () => {
    setCreateNoteThis(false);
  };
  const openModal = () => {
    setCreateNoteThis(true);
  };

  const results = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoMovies();
    }
  }, [data]);
   useEffect(() => {
     setPage(1)
  }, [isSearch]);
  return (
    <div className={css.app}>
      
	<header className={css.toolbar}>
		<SearchBox
        value={input}
          onChange={(val) => {
            setInput(val);
            debouncedSetQuery(val);
          }}
      />
      {isSuccess && totalPages > 1 && (
        <Paginate
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
      <button onClick={openModal} className={css.button}>Create note +</button>

  </header>
{(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      
      
      {!isLoading && !isError && results.length > 0 && (
        <NoteList
          movies={data?.notes || []}
          
        />
      )}
      
      {createNoteThis && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
