import { Imagotipo } from '@/components/logo';
import { Body } from '@/components/typography';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main
      style={{
        backgroundImage: `url('/images/login.jpeg')`,
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
      className='w-full h-screen'
    >
      <div
        className='flex items-center justify-center '
        style={{
          backgroundColor: '#00000070',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Toaster position='bottom-right' />
        <article className='rounded-lg px-6 py-[72px] bg-white'>
          <Imagotipo className='mx-auto' />
          <Body.Small
            className='text-center pointer-events-none'
            text='Inicia sesión para continuar'
          />

          <Outlet />
        </article>
      </div>
    </main>
  );
}
