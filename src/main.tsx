import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index.tsx'
import Auth from './pages/Auth.tsx'
import Admin from './pages/Admin.tsx'
import SubmitAuction from './pages/SubmitAuction.tsx'
import NotFound from './pages/NotFound.tsx'
import { Toaster } from './components/ui/toaster'
import './index.css'
import './styles/globals.css'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/uploadart" element={<SubmitAuction />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
);
