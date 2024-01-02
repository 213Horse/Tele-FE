import styles from './WorkflowManagement.module.css';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { AiFillEdit } from 'react-icons/ai';
import { formatNumber } from '../../../../utils/functions';
import { EditWork } from '../../../../components/AdminCpns/EditWork';
import { useState } from 'react';
import { Loading } from '../../../../components/Loading';

function WorkflowManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [editWorkId, setEditWorkId] = useState();
  const { getWorks } = useAxios();

  const { data, isLoading } = useQuery(['getworks'], getWorks);
  function handleEdit(id) {
    setEditWorkId(id);
    setOpenModal(true);
  }
  return (
    <>
      {openModal ? (
        <EditWork
          editWorkId={editWorkId}
          setOpenModal={setOpenModal}
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
              <h3>Quản lý công việc</h3>
            </div>

            <div className={styles.listCall}>
              <div className={styles.head_new}>
                <span>STT</span>
                <span>Tên nhân viên</span>
                <span>Máy nhánh</span>
                <span>Số điện thoại</span>
                <span>Sửa</span>
              </div>
              {data &&
                data?.map((elm, index) => (
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
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WorkflowManagement;
