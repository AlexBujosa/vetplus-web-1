import { Route, Routes } from 'react-router-dom'
import { routes } from '@/config/routes'
import './index.css'
import '@/i18n/'
import { RolesAuthRoute } from './layout/roles'

export default function App() {
  return (
    <Routes>
      {Object.entries(routes).map(([key, value]) => {
        const { layout, pages } = value
        return (
          <Route key={key} element={layout}>
            {Object.entries(pages).map(([key, value]) => {
              const { href, page, allowedRoles } = value

              if (!allowedRoles) {
                return <Route key={key} path={href} element={page} />
              }

              return (
                <Route
                  key={key}
                  element={<RolesAuthRoute allowedRoles={allowedRoles} />}
                >
                  <Route path={href} element={page} />
                </Route>
              )
            })}
          </Route>
        )
      })}
    </Routes>
  )
}
