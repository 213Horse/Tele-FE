import { Navigate, Outlet } from 'react-router-dom';
// context
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
// components
import { LeftManager } from '../pages/Manager/LeftManager';
import { HeadManager } from '../layouts/Header/HeadManager';
import { Footer } from './Footer';
export function ManagerLayout() {
  const { user, brand } = useAuth();
  if (!brand) return <Navigate to={`/brand`} />;
  
  if (user && Object.values(user)[9] !== 'manager')
    return <Navigate to={`${Object.values(user)[9]}`} />;

  if (user === null) return <Navigate to='/login' />;
  const [hide, setHide] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  return (
    <>
      <LeftManager hide={hide} />
      <section id='content'>
        <HeadManager
          setShowToggle={setShowToggle}
          showToggle={showToggle}
          hide={hide}
          setHide={setHide}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
      </section>
    </>
  );
}
