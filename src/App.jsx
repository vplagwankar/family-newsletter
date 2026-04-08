import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }     from './context/AuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { useAuth }          from './hooks/useAuth.js'
import Navbar      from './components/layout/Navbar.jsx'
import Footer      from './components/layout/Footer.jsx'

// Public pages
import HomePage        from './pages/HomePage.jsx'
import EventsPage      from './pages/EventsPage.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import UpcomingPage    from './pages/UpcomingPage.jsx'
import CalendarPage    from './pages/CalendarPage.jsx'
import FamilyTreePage  from './pages/FamilyTreePage.jsx'
import GalleryPage     from './pages/GalleryPage.jsx'
import MembersPage     from './pages/MembersPage.jsx'
import SearchPage      from './pages/SearchPage.jsx'

// Admin pages
import AdminLoginPage      from './pages/AdminLoginPage.jsx'
import AdminDashboardPage  from './pages/AdminDashboardPage.jsx'
import AdminPostFormPage   from './pages/AdminPostFormPage.jsx'
import AdminMembersPage    from './pages/AdminMembersPage.jsx'
import AdminGalleryPage    from './pages/AdminGalleryPage.jsx'
import AdminTreeEditPage   from './pages/AdminTreeEditPage.jsx'

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────── */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
      <Route path="/events/:id" element={<PublicLayout><EventDetailPage /></PublicLayout>} />
      <Route path="/upcoming" element={<PublicLayout><UpcomingPage /></PublicLayout>} />
      <Route path="/calendar" element={<PublicLayout><CalendarPage /></PublicLayout>} />
      <Route path="/family-tree" element={<PublicLayout><FamilyTreePage /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
      <Route path="/members" element={<PublicLayout><MembersPage /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />

      {/* ── Admin ──────────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={
        <RequireAuth><AdminDashboardPage /></RequireAuth>
      } />
      <Route path="/admin/posts/new" element={
        <RequireAuth><AdminPostFormPage /></RequireAuth>
      } />
      <Route path="/admin/posts/:id/edit" element={
        <RequireAuth><AdminPostFormPage /></RequireAuth>
      } />
      <Route path="/admin/members" element={
        <RequireAuth><AdminMembersPage /></RequireAuth>
      } />
      <Route path="/admin/gallery" element={
        <RequireAuth><AdminGalleryPage /></RequireAuth>
      } />
      <Route path="/admin/family-tree/edit" element={
        <RequireAuth><AdminTreeEditPage /></RequireAuth>
      } />

      {/* Catch-all */}
      <Route path="*" element={
        <PublicLayout>
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <p className="text-6xl mb-4">🪔</p>
            <p className="text-xl font-semibold text-gray-600">Page not found</p>
            <a href="/" className="mt-4 text-terracotta hover:underline text-sm">← Back to home</a>
          </div>
        </PublicLayout>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}
