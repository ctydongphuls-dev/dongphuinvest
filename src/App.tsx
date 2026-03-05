import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import AboutPage from './pages/AboutPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import DashboardPage from './pages/DashboardPage'
import RaMatQuyDauTu from './pages/news/RaMatQuyDauTu'
import HoiThaoDauTu from './pages/news/HoiThaoDauTu'
import KyKetHopTac from './pages/news/KyKetHopTac'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/about' element={<AboutPage />} />
          <Route
            path='/services/uy-thac-dau-tu'
            element={<ServiceDetailPage />}
          />
          <Route
            path='/tin-tuc/ra-mat-quy-dau-tu-dp-capital'
            element={<RaMatQuyDauTu />}
          />
          <Route
            path='/tin-tuc/hoi-thao-dau-tu-thong-minh-2025'
            element={<HoiThaoDauTu />}
          />
          <Route
            path='/tin-tuc/ky-ket-hop-tac-chien-luoc'
            element={<KyKetHopTac />}
          />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
