import styles from './Configuration.module.css';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { AiFillEdit } from 'react-icons/ai';
import { formatNumber } from '../../../../utils/functions';
import { EditCode } from '../../../../components/AdminCpns/EditCode';
import { useState } from 'react';
import { Loading } from '../../../../components/Loading';

function Configuration() {
  const [openModal, setOpenModal] = useState(false);
  const [idCode, setIdCode] = useState();
  const { getWorks } = useAxios();
  const { data, isLoading, refetch } = useQuery(['getworks'], getWorks);

  function handleEditCode(id) {
    setIdCode(id);
    setOpenModal(true);
  }
  return (
    <>
      {openModal ? (
        <EditCode
          idCode={idCode}
          setOpenModal={setOpenModal}
          refetch={refetch}
        />
      ) : null}
      <div className={styles.box__content}>
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
              <h3>Quản lý máy nhánh</h3>
            </div>

            <div className={styles.listCall}>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Tên nhân viên</span>
                <span>Máy nhánh</span>
                <span>Số điện thoại</span>
                <span>Địa chỉ</span>
                <span>Sửa</span>
              </div>
              {data &&
                data.map((elm, index) => (
                  <div
                    key={index}
                    className={styles.content_new}
                  >
                    <span>{index + 1}</span>
                    <span>{elm.userName}</span>
                    <span>{elm.cfusername}</span>
                    <span>
                      {elm.phoneNumber ? formatNumber(elm.phoneNumber) : ''}
                    </span>
                    <span>{elm.address}</span>
                    <span>
                      <AiFillEdit
                        onClick={() => handleEditCode(elm.id)}
                        className={styles.editBtn}
                        style={{
                          cursor: 'pointer',
                          color: '#1775f1',
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

export default Configuration;
