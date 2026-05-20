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
import { notifyNoNotes } from "../../services/toast";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from 'use-debounce';
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm"
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);

const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        search: searchQuery || undefined,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });
 const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const results = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoNotes();
    }
  }, [data]);
   useEffect(() => {
     setPage(1)
  }, [searchQuery]);
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
        <Pagination
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
          notes={data?.notes || []}
          
        />
      )}
      
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
