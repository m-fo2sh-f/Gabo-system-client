import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRoutes'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {

  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
