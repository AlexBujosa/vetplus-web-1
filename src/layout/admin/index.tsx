import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
  return (
    <main className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-grow'>
        <Header />
        <div className='flex flex-col gap-y-[50px] p-[35px] h-full bg-base-neutral-gray-200'>
          <Outlet />
          <Toaster position='top-right' />
        </div>
      </div>
    </main>
  )
}
