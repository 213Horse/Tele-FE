import styles from './UserReport.module.css';
import { FcCallback } from 'react-icons/fc';
import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import vi from 'date-fns/locale/vi';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { EditUser } from '../../../../components/ManagerCpns/EditUser';
import { useSip } from '../../../../context/SipContext';
import { CallToUser } from '../../../../components/ManagerCpns/CallToUser';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { Loading } from '../../../../components/Loading';
import ChartCallMonth from '../../../../components/Charts/ChartCallMonth';

function UserReport() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const [selectMonth, setSelectMonth] = useState(new Date());
  const { brand } = useAuth();
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [openFormCall, setOpenFormCall] = useState(false);
  const [idEdit, setIdEdit] = useState();
  const { getAllUser, getStaffByDate, getStaffByMonth, getAllCallByMonthMng } =
    useAxios();
  const { data, refetch } = useQuery(['getAllUserMng'], getAllUser);
  const { rejectStt, deviceclv, setRejectStt } = useSip();
  function handleEdit(id) {
    setIdEdit(id);
    setEditModal(true);
  }

  function handleCallToUser(number) {
    deviceclv?.current.initiateCall(number);
    setOpenFormCall(true);
  }
  // get all order by date
  const { data: totalCall, isLoading } = useQuery(
    ['alstaffbydate', startDate, endDate, brand],
    () =>
      getStaffByDate({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );
  // get all order by month
  const { data: totalCallMonth, isLoading: loadingMonth } = useQuery(
    ['orderByMonth', selectMonth.getFullYear(), selectMonth.getMonth(), brand],
    () =>
      getStaffByMonth({
        year: selectMonth.getFullYear(),
        month: selectMonth.getMonth() + 1,
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );
  // get all call by month
  const { data: callByMonth } = useQuery(
    [
      'callByMonthMng',
      selectMonth.getFullYear(),
      selectMonth.getMonth(),
      brand,
    ],
    () =>
      getAllCallByMonthMng({
        year: selectMonth.getFullYear(),
        month: selectMonth.getMonth() + 1,
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );

  return (
    <>
      <div className={styles.box__content}>
        {openFormCall ? (
          <CallToUser
            deviceclv={deviceclv}
            setRejectStt={setRejectStt}
            rejectStt={rejectStt}
            setOpenFormCall={setOpenFormCall}
          />
        ) : null}
        {editModal ? (
          <EditUser
            refetch={refetch}
            idEdit={idEdit}
            setEditModal={setEditModal}
          />
        ) : null}
        <>
          <div className={styles.head__box}>
            <h3>Quản lý nhân viên</h3>
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
                  <span>Tên nhân viên</span>
                  <span>Máy nhánh</span>
                  <span>Trạng thái</span>
                  <span>Số điện thoại</span>
                  <span>Địa chỉ</span>
                  <span>Sửa</span>
                  <span>Xem</span>
                  <span>Gọi qua máy nhánh</span>
                </div>
                {data &&
                  data.map((elm, index) => (
                    <div
                      key={index}
                      className={styles.content_new}
                    >
                      <span>{index + 1}</span>
                      <span>{elm.firstName + ' ' + elm.lastName}</span>
                      <span>{elm.cfusername}</span>
                      <span>OFFline</span>
                      <span>{elm.phoneNumber}</span>
                      <span>{elm.address}</span>
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
                        <GrView
                          className={styles.editBtn}
                          onClick={() => navigate(`/details-staff/${elm.id}`)}
                          style={{
                            cursor: 'pointer',
                            color: '#1775f1',
                            fontSize: '22px',
                          }}
                        />
                      </span>
                      <span>
                        <FcCallback
                          onClick={() => handleCallToUser(elm.phoneNumber)}
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
              </>
            )}
          </div>
        </>
      </div>
      <div className={styles.box__content}>
        <>
          <h4>Báo cáo ngày</h4>
          <div className={styles.dates}>
            <div>
              <DatePicker
                locale={vi}
                selected={startDate}
                onChange={(date) => {
                  if (endDate - date > 31 * 24 * 60 * 60 * 1000) {
                    toast('Chỉ xử lý được trong khoảng 30 ngày', {
                      icon: '👏',
                      style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                      },
                    });
                    return;
                  }
                  return setStartDate(date);
                }}
              />
            </div>
            <strong> Tới</strong>
            <div>
              <DatePicker
                locale={vi}
                selected={endDate}
                onChange={(date) => {
                  if (date - startDate > 31 * 24 * 60 * 60 * 1000) {
                    toast('Chỉ xử lý được trong khoảng 30 ngày', {
                      icon: '👏',
                      style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                      },
                    });
                    return;
                  }
                  return setEndDate(date);
                }}
              />
            </div>
          </div>
          <div className={styles.head__box}>
            <h3>Báo cáo cuộc gọi từ</h3>
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
                <div className={styles.head_new2}>
                  <span>STT</span>
                  <span>Tên nhân viên</span>
                  <span>Username</span>
                  <span>Máy nhánh</span>
                  <span>Tổng cuộc gọi</span>
                </div>
                {totalCall &&
                  totalCall?.map((elm, index) => (
                    <div
                      key={index}
                      className={styles.content_new2}
                    >
                      <span>{index + 1}</span>
                      <span>
                        {elm.user.firstName + ' ' + elm.user.lastName}
                      </span>
                      <span>{elm.user.userName}</span>
                      <span>{elm.user.cfusername}</span>
                      <span>{elm.totalCall}</span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </>
      </div>

      <div className={styles.box__content}>
        <>
          <div className={styles.head__box}>
            <h3>Chi tiết cuộc gọi</h3>
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
                <div className={styles.head_new3}>
                  <span>STT</span>
                  <span>Tên nhân viên</span>
                  <span>{'< 1 phút'}</span>
                  <span>{'> 2 phút'}</span>
                  <span>Không trả lời</span>
                  <span>Tổng cuộc gọi</span>
                  <span>Tổng hóa đơn</span>
                </div>
                {totalCall &&
                  totalCall?.map((elm, index) => (
                    <div
                      key={index}
                      className={styles.content_new3}
                    >
                      <span>{index + 1}</span>
                      <span>
                        {elm.user.firstName + ' ' + elm.user.lastName}
                      </span>
                      <span>{elm.oneMinutes}</span>
                      <span>{elm.twoMinutes + elm.threeMinutes}</span>
                      <span>{elm.totalNoAnswer}</span>
                      <span>{elm.totalCall}</span>
                      <span>{elm.totalOrder}</span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </>
      </div>

      <div className={styles.box__content}>
        <>
          <h4>Báo cáo Tháng</h4>
          <div className={styles.head__box}>
            <h3>Báo cáo cuộc gọi tháng 02 2023</h3>
          </div>
          <div className={styles.dates}>
            <div>
              <DatePicker
                selected={selectMonth}
                onChange={(date) => setSelectMonth(date)}
                dateFormat='MM/yyyy'
                locale={vi}
                showMonthYearPicker
              />
            </div>
          </div>
          <div className={styles.listCall}>
            {loadingMonth ? (
              <div className={styles.loading__tb}>
                <Loading
                  size='90'
                  color='#fc3b56'
                />
              </div>
            ) : (
              <>
                <div className={styles.head_new3}>
                  <span>STT</span>
                  <span>Tên nhân viên</span>
                  <span>{'< 1 phút'}</span>
                  <span>{'> 2 phút'}</span>
                  <span>Không trả lời</span>
                  <span>Tổng cuộc gọi</span>
                  <span>Tổng hóa đơn</span>
                </div>
                {totalCallMonth &&
                  totalCallMonth?.map((elm, index) => (
                    <div
                      key={index}
                      className={styles.content_new3}
                    >
                      <span>{index + 1}</span>
                      <span>
                        {elm.user.firstName + ' ' + elm.user.lastName}
                      </span>
                      <span>{elm.oneMinutes}</span>
                      <span>{elm.twoMinutes + elm.threeMinutes}</span>
                      <span>{elm.totalNoAnswer}</span>
                      <span>{elm.totalCall}</span>
                      <span>{elm.totalOrder}</span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </>
        <div className={styles.charts}>
          <div className={styles.chart}>
            <h5>Tổng Cuộc Gọi Trong Tháng</h5>
            <ChartCallMonth callByMonth={callByMonth} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserReport;
