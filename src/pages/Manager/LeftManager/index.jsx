import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/lg.png';

export function LeftManager({ hide }) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <section
      id='sidebar'
      className={hide ? 'hide' : ''}
    >
      <a className='brand'>
        <i className='bx bxs-smile icon'></i> Manager
      </a>
      <ul className='side-menu'>
        <li
          className='divider'
          data-text='table and forms'
        >
          Báo cáo
        </li>
        <li onClick={() => navigate('/manager')}>
          <a
            className={location.pathname.startsWith('/manager') ? 'active' : ''}
          >
            <i className='bx bxs-chart icon'></i> Bảng thông tin
          </a>
        </li>
        <li onClick={() => navigate('/mng-bao-cao-cuoc-goi')}>
          <a
            className={
              location.pathname.startsWith('/mng-bao-cao-cuoc-goi')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Báo cáo cuộc gọi
          </a>
        </li>
        <li onClick={() => navigate('/mng-quan-ly-nhan-vien')}>
          <a
            className={
              location.pathname.startsWith('/mng-quan-ly-nhan-vien')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý nhân viên
          </a>
        </li>
        <li onClick={() => navigate('/mng-bao-cao-chien-dich')}>
          <a
            className={
              location.pathname.startsWith('/mng-bao-cao-chien-dich')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Báo cáo chiến dịch
          </a>
        </li>
        <li
          className='divider'
          data-text='table and forms'
        >
          Quản lý
        </li>
        <li onClick={() => navigate('/mng-khach-hang')}>
          <a
            className={
              location.pathname.startsWith('/mng-khach-hang') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý khách hàng
          </a>
        </li>
        <li onClick={() => navigate('/mng-level')}>
          <a
            className={
              location.pathname.startsWith('/mng-level') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý level
          </a>
        </li>
        <li onClick={() => navigate('/mng-chi-nhanh')}>
          <a
            className={
              location.pathname.startsWith('/mng-chi-nhanh') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý chi nhánh
          </a>
        </li>
        <li onClick={() => navigate('/mng-nguon-khach-hang')}>
          <a
            className={
              location.pathname.startsWith('/mng-nguon-khach-hang')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý nguồn KH
          </a>
        </li>
        <li onClick={() => navigate('/mng-kenh-khach-hang')}>
          <a
            className={
              location.pathname.startsWith('/mng-kenh-khach-hang')
                ? 'active'
                : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý kênh KH
          </a>
        </li>
        <li onClick={() => navigate('/mng-danh-muc')}>
          <a
            className={
              location.pathname.startsWith('/mng-danh-muc') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý Danh mục
          </a>
        </li>
        <li onClick={() => navigate('/mng-san-pham')}>
          <a
            className={
              location.pathname.startsWith('/mng-san-pham') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý sản phẩm
          </a>
        </li>
        <li onClick={() => navigate('/mng-chien-dich')}>
          <a
            className={
              location.pathname.startsWith('/mng-chien-dich') ? 'active' : ''
            }
          >
            <i className='bx bxs-widget icon'></i> Quản lý chiến dịch
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
