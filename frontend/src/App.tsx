import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Renovations from './pages/Renovations'
import Expenses from './pages/Expenses'
import ExpensePage from './pages/ExpensePage'
import Sponsors from './pages/Sponsors'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0f0e0c] text-[#e8e4dc] font-mono">
        <Sidebar />
        <main className="ml-[220px] flex-1 p-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/renovations" element={<Renovations />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/new" element={<ExpensePage />} />
            <Route path="/expenses/:id" element={<ExpensePage />} />
            <Route path="/sponsors" element={<Sponsors />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}