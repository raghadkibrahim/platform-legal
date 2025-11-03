import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Flash from "../components/Flash";
import { listCases, createCase, updateCase, deleteCase } from "../api/cases";
import { Link } from "react-router-dom";

type Nullable<T> = T | null | undefined;

interface CaseItem {
  id: number;
  title: string;
  reference?: Nullable<string>;
  notes?: Nullable<string>;
}

export default function Cases() {
  // data
  const [items, setItems] = useState<CaseItem[]>([]);
  // ui state
  const [err, setErr] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // create form
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editReference, setEditReference] = useState("");
  const [editNotes, setEditNotes] = useState("");

  async function load() {
    try {
      setErr(null);
      const data: CaseItem[] = await listCases();
      setItems(data);
    } catch (e: unknown) {
      const msg =
        (e as any)?.response?.data?.detail ??
        (e as Error)?.message ??
        "Error loading cases";
      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    try {
      const created = await createCase({
        title: title.trim(),
        reference: reference || undefined,
        notes: notes || undefined,
      });
      setItems((prev) => [created, ...prev]);
      setTitle("");
      setReference("");
      setNotes("");
      setFlash("Case created");
    } catch (e: unknown) {
      const msg =
        (e as any)?.response?.data?.detail ??
        (e as Error)?.message ??
        "Error creating case";
      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }

  function startEdit(c: CaseItem) {
    setEditingId(c.id);
    setEditTitle(c.title);
    setEditReference(c.reference ?? "");
    setEditNotes(c.notes ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditReference("");
    setEditNotes("");
  }

  async function saveEdit(id: number) {
    if (!editTitle.trim()) {
      setErr("Title is required");
      return;
    }
    try {
      const updated = await updateCase(id, {
        title: editTitle.trim(),
        reference: editReference || undefined,
        notes: editNotes || undefined,
      });
      setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
      cancelEdit();
      setFlash("Case updated");
    } catch (e: unknown) {
      const msg =
        (e as any)?.response?.data?.detail ??
        (e as Error)?.message ??
        "Error updating case";
      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }

  async function remove(id: number) {
    const ok = window.confirm("Delete this case? This cannot be undone.");
    if (!ok) return;
    // optimistic update
    const prev = items;
    setItems((curr) => curr.filter((p) => p.id !== id));
    try {
      await deleteCase(id);
      setFlash("Case deleted");
    } catch (e: unknown) {
      setErr(
        (e as any)?.response?.data?.detail ??
          (e as Error)?.message ??
          "Error deleting case"
      );
      // roll back
      setItems(prev);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">My Cases</h1>

      {err && <p className="text-red-600 mb-3">{err}</p>}

      {/* List + inline edit */}
      <ul className="space-y-2">
        {items.map((c) => {
          const isEditing = editingId === c.id;
          return (
            <li key={c.id} className="bg-white border rounded p-3">
              {!isEditing ? (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">
                      <Link to={`/cases/${c.id}`} className="underline hover:text-blue-600">
                       {c.title}
                       </Link>
                      </div>
                    {c.reference && (
                      <div className="text-sm text-gray-600">
                        {c.reference}
                      </div>
                    )}
                    {c.notes && <div className="text-sm mt-1">{c.notes}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="text-sm px-3 py-1.5 rounded border"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(c.id)}
                      className="text-sm px-3 py-1.5 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    className="border rounded px-3 py-2"
                    placeholder="Title *"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="border rounded px-3 py-2"
                    placeholder="Reference"
                    value={editReference}
                    onChange={(e) => setEditReference(e.target.value)}
                  />
                  <input
                    className="border rounded px-3 py-2 md:col-span-3"
                    placeholder="Notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="md:col-span-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void saveEdit(c.id)}
                      className="px-4 py-2 rounded bg-black text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {items.length === 0 && !err && (
          <p className="text-gray-500">No cases yet.</p>
        )}
      </ul>

      <Flash message={flash} onClear={() => setFlash(null)} />
    </>
  );
}
