import styles from './BranchManager.module.css';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useAxios } from '../../../../context/AxiosContex';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loading } from '../../../../components/Loading';
import { useState } from 'react';
import { EditStore } from '../../../../components/ManagerCpns/EditStore';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { toast } from 'react-hot-toast';
import { AddStore } from '../../../../components/ManagerCpns/AddStore';

function BranchManager() {
  const { getStores, deleteStoresById } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: stores,
    isLoading,
    refetch,
  } = useQuery(['getStores', brand], () => getStores(brand), {
    enabled: !!brand,
  });

  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteStore = useMutation({
    mutationFn: (data) => {
      return deleteStoresById(data).then((res) => {
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
      deleteStore.mutate({ id: id, data: { status: 1 } });
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddStore
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditStore
            refetch={refetch}
            idEdit={idEdit}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý chi nhánh</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm chi nhánh
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className={styles.loading__tb}>
            <Loading
              size='90'
              color='#fc3b56'
            />
          </div>
        ) : (
          <>
            <div className={styles.listCall}>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Tên chi nhánh</span>
                <span>Thương hiệu</span>
                <span>Địa chỉ</span>
                <span>Email</span>
                <span>Số điện thoại</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {stores?.map((store, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{store.name}</span>
                  <span>{store.brandName}</span>
                  <span>{store.address}</span>
                  <span>{store.email}</span>
                  <span>{store.phoneNumber}</span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(store.id)}
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
                      onClick={() => handleOnClick(store.id)}
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

export default BranchManager;
