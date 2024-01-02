import styles from './CtmResourceManager.module.css';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useAxios } from '../../../../context/AxiosContex';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loading } from '../../../../components/Loading';
import { formartDate } from '../../../../utils/functions';
import { useState } from 'react';
import { EditSource } from '../../../../components/ManagerCpns/EditSource';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { toast } from 'react-hot-toast';
import { AddSource } from '../../../../components/ManagerCpns/AddSource';

function CtmResourceManager() {
  const { getSources, deleteSource } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: sources,
    isLoading,
    refetch,
  } = useQuery(['getSources', brand], () => getSources(brand), {
    enabled: !!brand,
  });
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteSourceMutation = useMutation({
    mutationFn: (data) => {
      return deleteSource(data).then((res) => {
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
      deleteSourceMutation.mutate(id);
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {editModal ? (
          <EditSource
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        {openModal ? (
          <AddSource
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý nguồn khách hàng</h3>
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
                <span>Mã nguồn</span>
                <span>Nguồn khách hàng</span>
                <span>Ngày chỉnh sử</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {sources?.map((source, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{source.title}</span>
                  <span>{source.description}</span>
                  <span>
                    {source.lastEditTime &&
                      formartDate(source.lastEditTime, 'short')}
                  </span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(source.id)}
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
                      onClick={() => handleOnClick(source.id)}
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

export default CtmResourceManager;
