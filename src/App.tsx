
import { RouterProvider } from 'react-router-dom'
import './App.css'
// import DashboardLayout from './layout/dashboard-layout'
import router from './routes/routes'
import { NotificationProvider } from './components/common/notification/notification'
import { TooltipProvider } from './components/ui/tooltip'

function App() {

  return (
    <>
      <TooltipProvider>

        <RouterProvider router={router} /> 
        <NotificationProvider /> 
      </TooltipProvider>
    </>
  )
}

export default App
