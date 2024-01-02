import styles from './OrderReport.module.css';
import vi from 'date-fns/locale/vi';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { formatMoney } from '../../../../utils/functions';

export default function OrderReport() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const { getAllOrderBydate, getAllProductsStaff } = useAxios();
  const { brand, user } = useAuth();

  // get all order by date
  const { data: order } = useQuery(
    ['allorderdate', startDate, endDate, brand, user?.Id],
    () =>
      getAllOrderBydate({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        BrandId: +brand,
        UserId: +user?.Id,
      }),
    {
      enabled: !!brand,
    },
  );
  const { data: productStaff } = useQuery(
    ['allorderdate', brand],
    () => getAllProductsStaff(+brand),
    {
      enabled: !!brand,
    },
  );
console.log(productStaff)
  return (
    <div className={styles.reportOrder}>
      <h5 className={styles.title}>Báo cáo ngày</h5>
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
      <div className={styles.statistical}>
        <h4>Thống kê theo ngày: 2023-02-01 Tới ngày 2023-01-06</h4>
        <div className={styles.contents}>
          <div className={styles.content}>
            <strong>Tổng hóa đơn</strong>
            <h2>{order?.totalOrder}</h2>
          </div>
          <div className={styles.content}>
            <strong>Order/Cuộc gọi</strong>
            <h2>{order?.totalOrder}</h2>
          </div>
          <div className={styles.content}>
            <strong>Bình quân hóa đơn</strong>
            <h2>
              {' '}
              {order?.totalOrder
                ? formatMoney(order?.revenue / order?.totalOrder)
                : formatMoney(0)}
            </h2>
          </div>
          <div className={styles.content}>
            <strong>Doanh thu</strong>
            <h2>{formatMoney(order?.revenue)}</h2>
          </div>
        </div>
      </div>
      <div className={styles.listCall}>
        <div className={styles.box__content}>
          <div className={styles.head__box}>
            <h3>Thống kê đơn hàng cuả bạn</h3>
          </div>
          <div className={styles.head_new}>
            <span>STT</span>
            <span>Sản phẩm / Dịch vụ</span>
            <span>Giá tiền</span>
            <span>Doanh thu</span>
            <span>Tổng hóa đơn</span>
          </div>
          {productStaff &&
            productStaff?.map((prd, index) => (
              <div
                key={index}
                className={styles.content_new}
              >
                <span>{index + 1}</span>
                <span>{prd.name}</span>
                <span>{prd.price}</span>
                <span>{prd.revenue}</span>
                <span>{prd.totalOrder}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
