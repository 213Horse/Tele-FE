import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/lg.png';

export function LeftStaff({ hide }) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <section
      id='sidebar'
      className={hide ? 'hide' : ''}
    >
      <a className='brand'>
        <i className='bx bxs-smile icon'></i> Admin
      </a>
      <ul className='side-menu'>
        <li onClick={() => navigate('/admin')}>
          <a className={location.pathname.startsWith('/admin') ? 'active' : ''}>
            <i className='bx bxs-chart icon'></i> Quản lý thương hiệu
          </a>
        </li>
        <li onClick={() => navigate('/adm-manager-user')}>
          <a
            className={
              location.pathname.startsWith('/adm-manager-user') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý người dùng
          </a>
        </li>
        <li onClick={() => navigate('/adm-manager-work')}>
          <a
            className={
              location.pathname.startsWith('/adm-manager-work') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý công việc
          </a>
        </li>
        <li onClick={() => navigate('/adm-manager-config')}>
          <a
            className={
              location.pathname.startsWith('/adm-manager-config')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Cấu hình máy nhánh
          </a>
        </li>
      </ul>
      <div className='ads'>
        <div className='wrapper'>
          <a
            href='#'
            className='btn-upgrade'
          >
            <img
              className='imglg'
              src={logo}
              alt='logo'
            />
          </a>
          <p>
            Sử dụng <span>Telesale</span> để tận hưởng <span>tất cả!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
