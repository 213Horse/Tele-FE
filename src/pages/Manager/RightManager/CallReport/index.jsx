import styles from './CallReport.module.css';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import ChartCircleCall from '../../../../components/Charts/ChartCircleCall';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function CallReport() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const { getAllHtrCallManager } = useAxios();
  const { user, brand } = useAuth();

  const { data: htrCall } = useQuery(
    ['htrCall', startDate, endDate, brand, user?.Id],
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
  return (
    <div className={styles.callsboard}>
      <div className={styles.reportCall}>
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
          <div className={styles.charts}>
            <div className={styles.chart}>
              <h5>Thống kê cuộc gọi</h5>
              <div>
                <ChartCircleCall htrCall={htrCall} />
              </div>
            </div>
            <div className={styles.listCall}>
              <div className={styles.box__content}>
                <div className={styles.head__box}>
                  <h3>Cuộc gọi chi tiết theo ngày</h3>
                </div>
                <div className={styles.head_new}>
                  <span>STT</span>
                  <span>Ngày</span>
                  <span>Nghe máy</span>
                  <span>Tắt máy</span>
                  <span>Máy bận</span>
                  <span>Không nhấc máy</span>
                  <span>Tổng</span>
                </div>

                {htrCall?.listCall &&
                  htrCall?.listCall
                    .sort(function (a, b) {
                      return (
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                      );
                    })
                    .map((htr, index) => (
                      <div
                        key={index}
                        className={styles.content_new}
                      >
                        <span>{index + 1}</span>
                        <span>{htr.date}</span>
                        <span className={`${htr.answer != 0 && styles.bold}`}>
                          {htr.answer}
                        </span>
                        <span
                          className={`${htr.staffOff != 0 && styles.bold2}`}
                        >
                          {htr.staffOff}
                        </span>
                        <span className={`${htr.reject != 0 && styles.bold3}`}>
                          {htr.reject}
                        </span>
                        <span
                          className={`${htr.noAnswer != 0 && styles.bold4}`}
                        >
                          {htr.noAnswer}
                        </span>
                        <span>
                          {htr.noAnswer +
                            htr.answer +
                            htr.staffOff +
                            htr.reject}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
