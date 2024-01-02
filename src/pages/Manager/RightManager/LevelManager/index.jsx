import styles from './LevelManager.module.css';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import { useAxios } from '../../../../context/AxiosContex';
import { Loading } from '../../../../components/Loading';
import { useState } from 'react';
import { EditLevel } from '../../../../components/ManagerCpns/EditLevel';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { toast } from 'react-hot-toast';
import { AddLevel } from '../../../../components/ManagerCpns/AddLevel/AddLevel';

function LevelManager() {
  const { getLevelUser, deleteLevelById } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: levelmng,
    isLoading,
    refetch,
  } = useQuery(['getlevelMng', brand], () => getLevelUser(brand), {
    enabled: !!brand,
  });
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteLevels = useMutation({
    mutationFn: (data) => {
      return deleteLevelById(data).then((res) => {
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
      deleteLevels.mutate({ id: id, data: { status: 1 } });
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddLevel
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditLevel
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý level</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm level
            </button>
          </div>
        </div>

        <div className={styles.listCall}>
          {isLoading ? (
            <div className={styles.loading__tb}>
              <Loading
                size='90'
                color='#fc3b56'
              />
            </div>
          ) : (
            <>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Tên level</span>
                <span>Level note</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {levelmng.map((elm, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{elm.name}</span>
                  <span>{elm.note}</span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(elm.id)}
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
                      onClick={() => handleOnClick(elm.id)}
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LevelManager;
