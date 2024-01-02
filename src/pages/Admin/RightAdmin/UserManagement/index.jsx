import styles from './UserManagement.module.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAxios } from '../../../../context/AxiosContex';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AiFillEdit } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useState } from 'react';
import { AddUserModal } from '../../../../components/AdminCpns/AddUserModal';
import { EditUserModal } from '../../../../components/AdminCpns/EditUserModal';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { formatNumber } from '../../../../utils/functions';
import { Loading } from '../../../../components/Loading';
import { toast } from 'react-hot-toast';

function UserManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [idEdit, setIdEdit] = useState();
  const { getAllUser, deleteUserByID } = useAxios();
  const { data, refetch, isLoading } = useQuery(['getAllUseradm'], getAllUser);
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteCustomer = useMutation({
    mutationFn: (data) => {
      return deleteUserByID(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        refetch();
        toast('Xoá thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    },
  });

  async function handleOnClick(id) {
    function handleDelete() {
      deleteCustomer.mutate(id);
    }
    await confirm(handleDelete);
  }

  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddUserModal
            refetch={refetch}
            setOpenModal={setOpenModal}
          />
        ) : null}
        {editModal ? (
          <EditUserModal
            idEdit={idEdit}
            setEditModal={setEditModal}
          />
        ) : null}
        {isLoading ? (
          <div className={styles.loading__tb}>
            <Loading
              size='90'
              color='#fc3b56'
            />
          </div>
        ) : (
          <>
            <div className={styles.head__box}>
              <h3>Người dùng</h3>
              <div className={styles.buttons}>
                <button
                  onClick={() => setOpenModal(true)}
                  className={`${styles.btn__black} ${styles.btn}`}
                >
                  <AiOutlinePlus style={{ marginRight: '5px' }} />
                  Thêm người dùng
                </button>
              </div>
            </div>

            <div className={styles.listCall}>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Tên</span>
                <span>Địa chỉ</span>
                <span>Số điện thoại</span>
                <span>Vai trò</span>
                <span>Email</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {data &&
                data
                  ?.filter((elm) => elm.role !== 'manager')
                  .map((user, index) => (
                    <div
                      key={index}
                      className={styles.content_new}
                    >
                      <span>{index + 1}</span>
                      <span>{user.firstName + user.lastName}</span>
                      <span>{user.address}</span>
                      <span>
                        {user.phoneNumber ? formatNumber(user.phoneNumber) : ''}
                      </span>
                      <span>{user.role}</span>
                      <span>{user.email}</span>
                      <span>
                        <AiFillEdit
                          onClick={() => handleEdit(user.id)}
                          className={styles.editBtn}
                          style={{
                            cursor: 'pointer',
                            color: '#1775f1',
                            fontSize: '22px',
                          }}
                        />
                      </span>
                      <span>
                        <TiDelete
                          onClick={() => handleOnClick(user.id)}
                          className={styles.deleteBtn}
                          style={{
                            cursor: 'pointer',
                            color: '#fc3b56',
                            fontSize: '22px',
                          }}
                        />
                      </span>
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserManagement;
