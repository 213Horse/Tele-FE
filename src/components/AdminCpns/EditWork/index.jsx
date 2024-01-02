import styles from './EditWork.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from '../../Button';
import { motion } from 'framer-motion';
import { useAxios } from '../../../context/AxiosContex';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

export function EditWork({ setOpenModal, editWorkId }) {
  const { getUserBrand, getBrands, postUserBrand } = useAxios();
  const brandIdRef = useRef();
  const { data, refetch } = useQuery(
    ['editData', editWorkId],
    () => getUserBrand(+editWorkId),
    {
      enabled: !!editWorkId,
    },
  );
  const { data: brands } = useQuery(['brands'], getBrands);
  const createUserBrand = useMutation({
    mutationFn: (data) => {
      return postUserBrand(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        refetch();
        toast('Thêm thương hiệu thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setOpenModal(false);
      }
    },
  });
  function handleCreateBrandUser(e) {
    e.preventDefault();
    const dataPost = {
      userId: +editWorkId,
      brandId: brandIdRef.current?.value,
    };
    if (!brandIdRef.current?.value) {
      toast('Bạn đã tham gia hết thương hiệu', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    createUserBrand.mutate(dataPost);
  }
  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className={styles.editWork}
    >
      <form>
        <div className={styles.head}>
          <h6>Thêm Thương hiệu</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.content}>
          <h6>Danh sách thương hiệu nhân viên đang tham gia:</h6>
          <ul>
            {data?.length ? (
              data?.map((elm, index) => <li key={index}>- {elm.brandName}</li>)
            ) : (
              <li>Bạn chưa tham gia chiến dịch nào</li>
            )}
          </ul>
          <h6>Thương hiệu chưa tham gia</h6>
          <select ref={brandIdRef}>
            {brands &&
              brands.map((brd, index) => {
                if (!data?.find((it) => it.brandId === brd.id)) {
                  return (
                    <option
                      value={brd.id}
                      key={index}
                    >
                      {brd.name}
                    </option>
                  );
                }
              })}
          </select>
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => setOpenModal(false)}
            className={styles.cancelbtn}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateBrandUser}
            className={styles.addbtn}
          >
            Thêm
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
