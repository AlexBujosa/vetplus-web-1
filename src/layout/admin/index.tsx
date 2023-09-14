import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'

export default function Layout() {
  return (
    <main className='flex h-screen'>
      <Sidebar />
      <div className='flex-grow'>
        <Header />
        <div className='flex flex-col gap-y-[30px] p-[35px] h-full bg-base-neutral-gray-200'>
          <Outlet />
        </div>
      </div>
    </main>
  )
}
