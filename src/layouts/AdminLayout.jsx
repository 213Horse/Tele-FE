import { Navigate, Outlet } from 'react-router-dom';
// context
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
// components
import { LeftStaff } from '../pages/Admin/LeftAdmin';
import { HeaderAdmin } from '../layouts/Header/HeadAdmin';
import { Footer } from './Footer';
export function AdminLayout() {
  const { user } = useAuth();
  if (user && Object.values(user)[9] !== 'admin')
    return <Navigate to={`${Object.values(user)[9]}`} />;

  if (user === null) return <Navigate to='/login' />;
  const [hide, setHide] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  return (
    <>
      <LeftStaff hide={hide} />
      <section id='content'>
        <HeaderAdmin
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
