import styles from './ChannelManager.module.css';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import { useAxios } from '../../../../context/AxiosContex';
import { Loading } from '../../../../components/Loading';
import { useState } from 'react';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { toast } from 'react-hot-toast';
import { formartDate } from '../../../../utils/functions';
import { EditChannel } from '../../../../components/ManagerCpns/EditChannel/EditChannel';
import { AddChannel } from '../../../../components/ManagerCpns/AddChannel';

function ChannelManager() {
  const { getChannels, deleteChannel } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: channels,
    isLoading,
    refetch,
  } = useQuery(['getchannelmng', brand], () => getChannels(brand), {
    enabled: !!brand,
  });
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteChannelAction = useMutation({
    mutationFn: (data) => {
      return deleteChannel(data).then((res) => {
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
      deleteChannelAction.mutate(id);
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddChannel
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditChannel
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý kênh</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm kênh
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
                <span>Mã kênh</span>
                <span>Kênh</span>
                <span>Ngày chỉnh sửa</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {channels?.map((channel, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{channel.code}</span>
                  <span>{channel.name}</span>
                  <span>
                    {channel.lastEditTime
                      ? formartDate(channel.lastEditTime, 'short')
                      : null}
                  </span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(channel.id)}
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
                      onClick={() => handleOnClick(channel.id)}
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

export default ChannelManager;
