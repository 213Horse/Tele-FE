import styles from './CampaignManager.module.css';
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
import { AddCampaign } from '../../../../components/ManagerCpns/AddCampaign';
import { EditCampaign } from '../../../../components/ManagerCpns/EditCampaign';

function CampaignManager() {
  const { getAllCampaignMng, deleteCampaignById } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: allCampaign,
    isLoading,
    refetch,
  } = useQuery(['getcampaign', brand], () => getAllCampaignMng(brand), {
    enabled: !!brand,
  });
  const deleteCampaingAction = useMutation({
    mutationFn: (data) => {
      return deleteCampaignById(data).then((res) => {
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
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  async function handleOnClick(id) {
    function handleDelete() {
      deleteCampaingAction.mutate({ id: id, data: { status: 1 } });
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddCampaign
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditCampaign
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý chiến dịch</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm chiến dịch
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
                <span>Chiến dịch</span>
                <span>Ngày bắt đầu</span>
                <span>Ngày kết thúc</span>
                <span>Doanh thu dự kiến</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {allCampaign?.map((cpn, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{cpn.name}</span>
                  <span>{formartDate(cpn.startDate, 'short')}</span>
                  <span>{formartDate(cpn.expiredDate, 'short')}</span>
                  <span>{cpn.revenueExpect}</span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(cpn.id)}
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
                      onClick={() => handleOnClick(cpn.id)}
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

export default CampaignManager;
