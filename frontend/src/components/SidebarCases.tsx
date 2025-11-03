import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCases, createCase } from "../api/cases";

type CaseItem = { id: number; title: string; reference?: string | null };

export default function SidebarCases({ activePath }: { activePath: string }) {
  const nav = useNavigate();
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // new case form
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await listCases();
      setItems(data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const created = await createCase({
        title: title.trim(),
        reference: reference || undefined,
      });
      // add to list, reset form
      setItems(prev => [created, ...prev]);
      setTitle("");
      setReference("");
      setOpenForm(false);
      // navigate straight into the new workspace
      nav(`/cases/${created.id}`);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Error creating case");
    }
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">My Cases</h2>
        <button
          className="text-sm px-2 py-1 rounded border"
          onClick={() => setOpenForm(v => !v)}
        >
          {openForm ? "Close" : "New"}
        </button>
      </div>

      {openForm && (
        <form onSubmit={onCreate} className="mb-3 space-y-2">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Reference (optional)"
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
          <button className="w-full px-3 py-1.5 rounded bg-black text-white text-sm">Create</button>
        </form>
      )}

      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      {loading && <div className="text-gray-500 text-sm">Loading…</div>}

      <ul className="space-y-1">
        {items.map(c => {
          const active = activePath === `/cases/${c.id}`;
          return (
            <li key={c.id}>
              <Link
                to={`/cases/${c.id}`}
                className={`block px-2 py-1 rounded text-sm ${active ? "bg-black text-white" : "hover:bg-gray-100"}`}
                title={c.title}
              >
                {c.title}
              </Link>
              {c.reference && <div className="px-2 text-xs text-gray-500 truncate">Ref: {c.reference}</div>}
            </li>
          );
        })}
        {!loading && items.length === 0 && <li className="text-sm text-gray-500">No cases yet.</li>}
      </ul>
    </div>
  );
}
