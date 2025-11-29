
import { RouterProvider } from 'react-router-dom'
import './App.css'
// import DashboardLayout from './layout/dashboard-layout'
import router from './routes/routes'
import { NotificationProvider } from './components/common/notification/notification'
import { TooltipProvider } from './components/ui/tooltip'
import { AuthProvider } from './pages/auth/context/auth-context'

function App() {
  return (
    <>
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider router={router} />

        </AuthProvider>
        <NotificationProvider />
      </TooltipProvider>
    </>
  )
}

export default App
