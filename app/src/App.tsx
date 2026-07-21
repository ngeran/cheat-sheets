import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { UploadModal } from "./components/UploadModal";
import { CreateModal } from "./components/CreateModal";
import { Dashboard } from "./pages/Dashboard";
import { SheetView } from "./pages/SheetView";

export default function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header
        onImportClick={() => setShowUpload(true)}
        onCreateClick={() => setShowCreate(true)}
      />

      <Routes>
        <Route path="/" element={<Dashboard refreshKey={refreshKey} />} />
        <Route path="/sheets/:id" element={<SheetView />} />
      </Routes>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(sheet) => {
            setRefreshKey((k) => k + 1);
            setShowCreate(false);
            navigate(`/sheets/${sheet.id}`);
          }}
        />
      )}
    </div>
  );
}
