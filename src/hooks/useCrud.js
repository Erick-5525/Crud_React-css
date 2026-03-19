import { useState, useRef, useEffect } from "react";

const generateId = () => Math.random().toString(36).slice(2, 9);

export function useCrud() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("crud_react") || "[]");
    } catch {
      return [];
    }
  });

  const [input,   setInput]   = useState("");
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState("");
  const [filter,  setFilter]  = useState("todos");
  const [search,  setSearch]  = useState("");
  const [error,   setError]   = useState("");
  const [flash,   setFlash]   = useState(null);

  const inputRef = useRef(null);
  const editRef  = useRef(null);

  useEffect(() => {
    localStorage.setItem("crud_react", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (editId && editRef.current) editRef.current.focus();
  }, [editId]);

  const showFlash = (msg, type = "ok") => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 2000);
  };

  const visible = items
    .filter(i => i.text.includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (filter === "az") return a.text.localeCompare(b.text);
      if (filter === "za") return b.text.localeCompare(a.text);
      return 0;
    });

  const add = () => {
    const val = input.trim().toLowerCase();
    if (!val) {
      setError("Campo não pode ser vazio.");
      return;
    }
    if (items.some(i => i.text === val)) {
      setError(`"${val}" já existe.`);
      return;
    }
    setItems(prev => [...prev, { id: generateId(), text: val }]);
    setInput("");
    setError("");
    showFlash(`"${val}" adicionado!`);
    inputRef.current?.focus();
  };


  const startEdit = (item) => {
    setEditId(item.id);
    setEditVal(item.text);
    setError("");
  };

  const saveEdit = (id) => {
    const val = editVal.trim().toLowerCase();
    if (!val) {
      setError("Campo não pode ser vazio.");
      return;
    }
    if (items.some(i => i.text === val && i.id !== id)) {
      setError(`"${val}" já existe.`);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, text: val } : i));
    setEditId(null);
    setError("");
    showFlash("Item atualizado!");
  };

  const cancelEdit = () => {
    setEditId(null);
    setError("");
  };

  const remove = (id) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    if (editId === id) setEditId(null);
    showFlash(`"${item.text}" removido.`, "del");
  };

  const clearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    showFlash("Lista limpa.", "del");
  };

  return {
    items, visible,
    input, setInput,
    editId, editVal, setEditVal,
    filter, setFilter,
    search, setSearch,
    error, flash,
    
    inputRef, editRef,
    
    add, remove,
    startEdit, saveEdit, cancelEdit,
    clearAll,
  };
}
