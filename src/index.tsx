import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'
import { routes, authRoutes } from '@/config/routes'

import './index.css'
import '@/i18n/'
import { RolesAuthRoute } from './layout/roles'

export default function App() {
  const renderAuthRoutes = () => {
    return authRoutes.map(({ href, page }) => (
      <Route key={href} path={href} element={page} />
    ))
  }

  const renderAppRoutes = () => {
    return routes.map(({ href, allowedRoles, page }) => (
      <Route
        key={href}
        element={allowedRoles && <RolesAuthRoute allowedRoles={allowedRoles} />}
      >
        <Route path={href} element={page} />
      </Route>
    ))
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>{renderAuthRoutes()}</Route>
      <Route element={<Layout />}>{renderAppRoutes()}</Route>
      <Route path='*' element={<Navigate to='/admin' />} />
    </Routes>
  )
}
