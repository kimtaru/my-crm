import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Spinner from '@/components/Spinner'
import { LoginPage, routes } from '@/routes'

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootLayout />}>
            {routes.map(({ path, element: Page, index }) => (
              <Route
                key={path}
                index={index}
                path={index ? undefined : path}
                element={<Page />}
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
