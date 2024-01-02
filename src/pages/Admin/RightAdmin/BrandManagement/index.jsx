import styles from './BrandManagement.module.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAxios } from '../../../../context/AxiosContex';
import { useQuery } from '@tanstack/react-query';
import { AiFillEdit } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useState } from 'react';
import { AddCampaignAdm } from '../../../../components/AdminCpns/AddCampaignAdm';
import { EditCampaignAdm } from '../../../../components/AdminCpns/EditCampaignAdm';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { formatNumber } from '../../../../utils/functions';
import { Loading } from '../../../../components/Loading';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

function BrandManagement() {
  const { getAllBrand, deleteBrandById } = useAxios();
  const [openModal, setOpenModal] = useState(false);
  const [idBrand, setIdBrand] = useState();
  const [editModal, setEditModal] = useState(false);
  const { data, refetch, isLoading } = useQuery(['brandAdmin'], getAllBrand);
  function handleEdit(id) {
    setIdBrand(id);
    setEditModal(true);
  }

  const deleteBrand = useMutation({
    mutationFn: (data) => {
      return deleteBrandById(data).then((res) => {
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
      deleteBrand.mutate(id);
    }
    await confirm(handleDelete);
  }

  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddCampaignAdm
            refetch={refetch}
            setOpenModal={setOpenModal}
          />
        ) : null}
        {editModal ? (
          <EditCampaignAdm
            idBrand={idBrand}
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
              <h3>Thương hiệu</h3>
              <div className={styles.buttons}>
                <button
                  onClick={() => setOpenModal(true)}
                  className={`${styles.btn__black} ${styles.btn}`}
                >
                  <AiOutlinePlus style={{ marginRight: '5px' }} />
                  Thêm thương hiệu
                </button>
              </div>
            </div>

            <div className={styles.listCall}>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Thương hiệu</span>
                <span>Quản lý</span>
                <span>Số điện thoại</span>
                <span>Email</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {data &&
                data
                  ?.sort(function (a, b) {
                    return b.id - a.id;
                  })
                  .map((elm, index) => (
                    <div
                      key={index}
                      className={styles.content_new}
                    >
                      <span>{index + 1}</span>
                      <span>{elm.name}</span>
                      <span>{elm.managerName}</span>
                      <span>
                        {elm.phoneContact ? formatNumber(elm.phoneContact) : ''}
                      </span>
                      <span>{elm.email}</span>
                      <span>
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
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BrandManagement;
