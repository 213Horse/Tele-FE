// Context
import { useAuth } from '../../../context/AuthContext';
// Modules
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';

export function HeaderAdmin({ hide, setHide, setShowToggle, showToggle }) {
  //* Lấy dữ liệu từ context
  const { user, removeUser, removeToken, removeBrand } = useAuth();

  const navigate = useNavigate();

  //* Hàm Đăng xuất
  const handleLogout = () => {
    removeUser();
    removeToken();
    removeBrand();
    navigate('/login');
  };

  return (
    <>
      <nav>
        <i
          onClick={() => setHide(!hide)}
          className='bx bx-menu toggle-sidebar'
        ></i>
        <div className='user_profile'>
          <span>Xin chào: {user?.UserName}</span>
        </div>
        <span className='divider'></span>
        <div
          onClick={() => setShowToggle(!showToggle)}
          className='profile'
        >
          <Avatar
            style={{ cursor: 'pointer' }}
            name={user?.UserName}
            size={50}
            round='500px'
          />
          <ul className={`profile-link ${showToggle && 'show'} `}>
            <li>
              <a>
                <i className='bx bxs-user-circle icon'></i> Profile
              </a>
            </li>
            <li onClick={handleLogout}>
              <a>
                <i className='bx bxs-log-out-circle'></i> Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}