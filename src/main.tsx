import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Index from './pages/Index.tsx'
import { Toaster } from './components/ui/toaster'
import './index.css'
import './styles/globals.css'

// Lazy load route pages that aren't the main landing page
const Auth = lazy(() => import('./pages/Auth.tsx'))
const Admin = lazy(() => import('./pages/Admin.tsx'))
const SubmitAuction = lazy(() => import('./pages/SubmitAuction.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-black">Loading...</div></div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/uploadart" element={<SubmitAuction />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <Toaster />
  </BrowserRouter>
);
