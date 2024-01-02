import styles from './ProductManger.module.css';
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
import { AddProduct } from '../../../../components/ManagerCpns/AddProduct';
import { EditProduct } from '../../../../components/ManagerCpns/EditProduct';

function ProductManger() {
  const { getAllProductsMng, deleteProductById } = useAxios();
  const { brand } = useAuth();
  const [idEdit, setIdEdit] = useState();
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: allproducts,
    isLoading,
    refetch,
  } = useQuery(['getallprd', brand], () => getAllProductsMng(brand), {
    enabled: !!brand,
  });
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }
  const deleteProduct = useMutation({
    mutationFn: (data) => {
      return deleteProductById(data).then((res) => {
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
      deleteProduct.mutate({ id: id, data: { status: 1 } });
    }
    await confirm(handleDelete);
  }
  return (
    <>
      <div className={styles.box__content}>
        {openModal ? (
          <AddProduct
            setOpenModal={setOpenModal}
            refetch={refetch}
          />
        ) : null}
        {editModal ? (
          <EditProduct
            idEdit={idEdit}
            refetch={refetch}
            setEditModal={setEditModal}
          />
        ) : null}
        <div className={styles.head__box}>
          <h3>Quản sản phẩm</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm sản phẩm
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
                <span>Sản phẩm / Dịch vụ</span>
                <span>Danh mục</span>
                <span>Giá cũ</span>
                <span>Ngày tạo</span>
                <span>Sửa</span>
                <span>Xóa</span>
              </div>
              {allproducts?.map((prd, index) => (
                <div
                  key={index}
                  className={styles.content_new}
                >
                  <span>{index + 1}</span>
                  <span>{prd.name}</span>
                  <span>{prd.productCategoryName}</span>
                  <span>{prd.oldPrice}</span>
                  <span>{formartDate(prd.dateCreated, 'short')}</span>
                  <span>
                    {' '}
                    <AiFillEdit
                      onClick={() => handleEdit(prd.id)}
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
                      onClick={() => handleOnClick(prd.id)}
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

export default ProductManger;
