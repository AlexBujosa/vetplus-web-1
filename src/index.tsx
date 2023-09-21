import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'
import { routes, authRoutes } from '@/config/routes'

import './index.css'
import '@/i18n/'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {authRoutes.map((route) => {
          return (
            <Route key={route.href} path={route.href} element={route.page} />
          )
        })}
      </Route>

      <Route element={<Layout />}>
        {routes.map((route) => {
          return (
            <Route key={route.href} path={route.href} element={route.page} />
          )
        })}
        <Route path='*' element={<Navigate to='/admin' />} />
      </Route>
    </Routes>
  )
}
