import { useCrud } from "./hooks/useCrud.js";
import s from "./styles/styles.js";

const FILTERS = ["todos", "az", "za"];

const FILTER_LABELS = {
  todos: "Ordem original",
  az:    "A → Z",
  za:    "Z → A",
};

export default function App() {
  const {
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
  } = useCrud();

  return (
    <div style={s.root}>
      <div style={s.card}>

        <div style={s.header}>
          <div>
            <div style={s.tag}>CRUD</div>
            <h1 style={s.title}>Lista de Itens</h1>
          </div>
          <div style={s.counter}>
            <span style={s.counterNum}>{items.length}</span>
            <span style={s.counterLabel}>itens</span>
          </div>
        </div>

        <div
          style={{
            ...s.flash,
            opacity:    flash ? 1 : 0,
            background: flash?.type === "del" ? "#fce8e8" : "#e8f5e9",
            color:      flash?.type === "del" ? "#c0392b" : "#1b7a34",
          }}
        >
          {flash?.msg || "\u200b"}
        </div>

        <div style={s.addRow}>
          <input
            ref={inputRef}
            style={{ ...s.input, borderColor: error ? "#e55" : "var(--bord)" }}
            placeholder="Novo item..."
            value={input}
            onChange={e => { setInput(e.target.value); }}
            onKeyDown={e => e.key === "Enter" && add()}
          />
          <button style={s.btnAdd} onClick={add}>+ Adicionar</button>
        </div>
        {error && <p style={s.error}>{error}</p>}

        <div style={s.toolbar}>
          <input
            style={{ ...s.input, flex: 1, fontSize: 13 }}
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={s.filterGroup}>
            {FILTERS.map(f => (
              <button
                key={f}
                style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <div style={s.list}>
          {visible.length === 0 && (
            <div style={s.empty}>
              {search
                ? "Nenhum item encontrado."
                : "Nenhum item ainda. Adicione acima!"}
            </div>
          )}

          {visible.map((item, idx) => (
            <div
              key={item.id}
              className="crud-row"
              style={{ ...s.row, animationDelay: `${idx * 30}ms` }}
            >
              {editId === item.id ? (
                <div style={s.editRow}>
                  <input
                    ref={editRef}
                    style={{ ...s.input, flex: 1 }}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter")  saveEdit(item.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <button style={s.btnSave}   onClick={() => saveEdit(item.id)}>Salvar</button>
                  <button style={s.btnCancel} onClick={cancelEdit}>Cancelar</button>
                </div>
              ) : (
                <>
                  <div style={s.itemNum}>
                    {String(items.findIndex(i => i.id === item.id)).padStart(2, "0")}
                  </div>
                  <div style={s.itemText}>{item.text}</div>
                  <div style={s.actions}>
                    <button style={s.btnEdit} onClick={() => startEdit(item)} title="Editar">✎</button>
                    <button style={s.btnDel}  onClick={() => remove(item.id)} title="Remover">✕</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={s.footer}>
            <span style={s.footerInfo}>{visible.length} de {items.length} exibidos</span>
            <button style={s.btnClear} onClick={clearAll}>Limpar tudo</button>
          </div>
        )}

      </div>
    </div>
  );
}
