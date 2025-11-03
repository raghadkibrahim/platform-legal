// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Cases from "./pages/Cases";
import CaseDetail, {
  OverviewTab,
  DocumentsTab,
  NotesTab,
  AnalyzeTab,
} from "./pages/CaseDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/cases" replace />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetail />}>
            <Route index element={<OverviewTab />} />
            <Route path="documents" element={<DocumentsTab />} />
            <Route path="notes" element={<NotesTab />} />
            <Route path="analyze" element={<AnalyzeTab />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
