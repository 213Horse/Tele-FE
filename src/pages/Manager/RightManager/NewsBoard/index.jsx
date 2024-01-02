import styles from './NewsBoard.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import ChartOrder from '../../../../components/Charts/ChartOrder';
import ChartCall from '../../../../components/Charts/ChartCall';
import ChartCallMonth from '../../../../components/Charts/ChartCallMonth';
import ChartOrderMonth from '../../../../components/Charts/ChartOrderMonth';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import vi from 'date-fns/locale/vi';
import { toast } from 'react-hot-toast';
import { formatMoney, formartDate } from '../../../../utils/functions';

export default function NewsBoard() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );

  const [selectMonth, setSelectMonth] = useState(new Date());
  const {
    getAllOrderManager,
    getAllHtrCallManager,
    getAllOrderMonthManager,
    getAllCallByMonthManager,
  } = useAxios();
  const { brand } = useAuth();

  // get all order by date
  const { data: order } = useQuery(
    ['allorderdate', startDate, endDate, brand],
    () =>
      getAllOrderManager({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );
  // get all history call by date
  const { data: htrCall } = useQuery(
    ['htrCall2', startDate, endDate, brand],
    () =>
      getAllHtrCallManager({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );
  // get all order by month
  const { data: orderByMonth } = useQuery(
    ['orderByMonth2', selectMonth.getFullYear(), selectMonth.getMonth(), brand],
    () =>
      getAllOrderMonthManager({
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
    ['callByMonth2', selectMonth.getFullYear(), selectMonth.getMonth(), brand],
    () =>
      getAllCallByMonthManager({
        year: selectMonth.getFullYear(),
        month: selectMonth.getMonth() + 1,
        BrandId: +brand,
      }),
    {
      enabled: !!brand,
    },
  );

  return (
    <div className={styles.newsboard}>
      {/* report date */}
      <div className={styles.reportDate}>
        <h5 className={styles.title}>Báo cáo ngày</h5>
        <div className={styles.dates}>
          <div>
            <DatePicker
              locale={vi}
              selected={startDate}
              onChange={(date) => {
                if (endDate - date > 11 * 24 * 60 * 60 * 1000) {
                  toast('Chỉ xử lý được trong khoảng 10 ngày', {
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
                if (date - startDate > 11 * 24 * 60 * 60 * 1000) {
                  toast('Chỉ xử lý được trong khoảng 10 ngày', {
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
              <strong>Doanh thu</strong>
              <h2>{order?.revenue ? formatMoney(order?.revenue) : 0} </h2>
            </div>
            <div className={styles.content}>
              <strong>Bình quân hóa đơn</strong>
              <h2>
                {order?.totalOrder
                  ? formatMoney(order?.revenue / order?.totalOrder)
                  : formatMoney(0)}
              </h2>
            </div>
            <div className={styles.content}>
              <strong>Cuộc gọi đã nhận</strong>
              <h2>{htrCall?.totalAnswer}</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng cuộc gọi</strong>
              <h2>{htrCall?.totalCall}</h2>
            </div>
            <div className={styles.content}>
              <strong>Cuộc gọi đã nhận/Tổng cuộc gọi</strong>
              <h2>
                {htrCall?.totalCall
                  ? ((htrCall?.totalAnswer / htrCall?.totalCall) * 100)
                      .toString()
                      .slice(0, 6) + ' %'
                  : '0%'}
              </h2>
            </div>
          </div>
          <div className={styles.charts}>
            <div className={styles.chart}>
              <h5>
                Tổng Hóa Đơn Của Nhân Viên Từ {formartDate(startDate, 'short')}{' '}
                Tới Ngày {formartDate(endDate, 'short')}.
              </h5>
              <ChartOrder order={order} />
            </div>
            <div className={styles.chart}>
              <h5>
                Tổng Cuộc Gọi Của Nhân Viên Từ {formartDate(startDate, 'short')}{' '}
                Tới Ngày {formartDate(endDate, 'short')}.
              </h5>
              <ChartCall htrCall={htrCall} />
            </div>
          </div>
        </div>
      </div>
      {/* end report date */}
      {/* report month */}
      <div className={styles.reportDate}>
        <h5 className={styles.title}>Báo cáo tháng</h5>
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
        <div className={styles.statistical}>
          <h4>Thống kê theo tháng</h4>
          <div className={styles.contents}>
            <div className={styles.content}>
              <strong>Tổng hóa đơn</strong>
              <h2>{orderByMonth?.totalOrder}</h2>
            </div>
            <div className={styles.content}>
              <strong>Doanh thu</strong>
              <h2>{formatMoney(orderByMonth?.revenue)}</h2>
            </div>
            <div className={styles.content}>
              <strong>Bình quân hóa đơn</strong>
              <h2>
                {' '}
                {orderByMonth?.totalOrder
                  ? formatMoney(order?.revenue / orderByMonth?.totalOrder)
                  : formatMoney(0)}
              </h2>
            </div>
            <div className={styles.content}>
              <strong>Cuộc gọi đã nhận</strong>
              <h2>{callByMonth?.totalAnswer}</h2>
            </div>
            <div className={styles.content}>
              <strong>Tổng cuộc gọi</strong>
              <h2>{callByMonth?.totalCall}</h2>
            </div>
            <div className={styles.content}>
              <strong>Cuộc gọi đã nhận/Tổng cuộc gọi</strong>
              <h2>
                {' '}
                {callByMonth?.totalCall
                  ? ((callByMonth?.totalAnswer / callByMonth?.totalCall) * 100)
                      .toString()
                      .slice(0, 6) + ' %'
                  : '0%'}
              </h2>
            </div>
          </div>
          <div className={styles.charts}>
            <div className={styles.chart}>
              <h5>Tổng Cuộc Gọi Của Nhân Viên Trong Tháng</h5>
              <ChartCallMonth callByMonth={callByMonth} />
            </div>
            <div className={styles.chart}>
              <h5>Tổng Hóa Đơn Của Nhân Viên Trong Tháng</h5>
              <ChartOrderMonth orderByMonth={orderByMonth} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
