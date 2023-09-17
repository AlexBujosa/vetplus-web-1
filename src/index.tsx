import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'
import Login from '@/pages/[auth]/login'
import ForgotPassword from '@/pages/[auth]/forgot-password'
import routes from '@/config/routes'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
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
