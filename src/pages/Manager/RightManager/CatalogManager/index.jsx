import styles from './CatalogManager.module.css';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import { useAxios } from '../../../../context/AxiosContex';
import { Loading } from '../../../../components/Loading';
import { useState } from 'react';
import { confirm } from '../../../../components/AdminCpns/Confirm';
import { toast } from 'react-hot-toast';
import { AddCategory } from '../../../../components/ManagerCpns/AddCategory';
import { EditCategory } from '../../../../components/ManagerCpns/EditCategory';

function CatalogManager() {
  const { getProductCategories, deleteCategoryById } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: listview,
    isLoading,
    refetch,
  } = useQuery(['getprdctgr', brand], () => getProductCategories(brand), {
    enabled: !!brand,
  });
  const deleteCategoryAction = useMutation({
    mutationFn: (data) => {
      return deleteCategoryById(data).then((res) => {
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
      deleteCategoryAction.mutate({ id: id, data: { status: 1 } });
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddCategory
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditCategory
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản lý danh mục</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm danh mục
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
                <span>Tên danh mục</span>
                <span>Mô tả</span>
                <span>Tổng sản phẩm</span>
                <span>Thương hiệu</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {listview?.map((elm, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{elm.name}</span>
                  <span>{elm.description}</span>
                  <span>{elm.productNumber}</span>
                  <span>{elm.brandName}</span>
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

export default CatalogManager;
