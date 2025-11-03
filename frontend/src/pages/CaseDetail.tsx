// src/pages/CaseDetail.tsx
import { Link, NavLink, Outlet, useParams, useOutletContext } from "react-router-dom";
import type { ReactNode } from "react";

type CaseItem = { id: number; title: string; reference?: string | null; notes?: string | null };
type OutletCtx = { caseId: number; item: CaseItem };

function TabLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 text-sm rounded ${isActive ? "bg-black text-white" : "border"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const cid = Number(id || "0");

  // SAFE MODE: synthesize a case record without fetching
  const item: CaseItem = {
    id: cid || 999,
    title: `Case #${cid || 999}`,
    reference: "R-TEST",
    notes: "Temporary safe-mode notes",
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm">
        <Link to="/cases" className="underline">Cases</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="font-medium">{item.title}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-gray-600">
          {item.reference ? <>Ref: {item.reference}</> : <span className="italic">No reference</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabLink to=".">Overview</TabLink>
        <TabLink to="documents">Documents</TabLink>
        <TabLink to="notes">Notes</TabLink>
        <TabLink to="analyze">Analyze</TabLink>
      </div>

      {/* Tab content via nested routes */}
      <div className="bg-white border rounded p-4">
        <Outlet context={{ caseId: item.id, item }} />
      </div>
    </div>
  );
}

/* --------- Tab components (named exports) --------- */
export function OverviewTab() {
  const { item } = useOutletContext<OutletCtx>();
  return (
    <div className="space-y-2">
      <div><span className="font-medium">Title:</span> {item.title}</div>
      <div><span className="font-medium">Reference:</span> {item.reference || "—"}</div>
      <div><span className="font-medium">Notes:</span> {item.notes || "—"}</div>
    </div>
  );
}
export function DocumentsTab() {
  const { caseId } = useOutletContext<OutletCtx>();
  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">Upload and manage documents for this case (#{caseId}).</p>
      <button className="px-3 py-1.5 border rounded">Upload Document</button>
    </div>
  );
}
export function NotesTab() {
  const { item } = useOutletContext<OutletCtx>();
  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">Case notes</p>
      <textarea defaultValue={item.notes || ""} className="w-full min-h-40 border rounded p-2" />
    </div>
  );
}
export function AnalyzeTab() {
  const { caseId } = useOutletContext<OutletCtx>();
  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">Run your AI workflow on this case (#{caseId}).</p>
      <button className="px-3 py-1.5 bg-black text-white rounded">Analyze with AI</button>
    </div>
  );
}
