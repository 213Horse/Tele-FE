import styles from './CampaignReport.module.css';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../../../../context/AxiosContex';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import vi from 'date-fns/locale/vi';
import { toast } from 'react-hot-toast';
import ChartByCampaign from '../../../../components/Charts/ChartByCampaign';

export default function CampaignReport() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const { brand, user } = useAuth();
  const { getcampaigns, getOrderByCampaigns, getAllHtrCallByDateCpId } =
    useAxios();
  const [campaignId, setCampaignId] = useState();
  const [totalOrder, setTotalOrder] = useState(0);

  const { data: campaigns } = useQuery(
    ['campaigns', brand],
    () => getcampaigns(+brand),
    { enabled: !!brand },
  );
  const { data: orders } = useQuery(
    ['orders', campaignId],
    () => getOrderByCampaigns({ campaignId: +campaignId }),
    { enabled: !!campaignId },
  );
  const { data: htrCallByCampaign } = useQuery(
    ['htrCallByCampaign', startDate, endDate, brand, user?.Id],
    () =>
      getAllHtrCallByDateCpId({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        BrandId: +brand,
        UserId: +user?.Id,
        CampaignId: campaignId,
      }),
    {
      enabled: !!campaignId,
    },
  );

  useEffect(() => {
    if (orders) {
      orders.forEach((element) => {
        setTotalOrder((prev) => prev + element.order.amount);
      });
    } else {
      setTotalOrder(0);
    }
  }, [orders]);

  return (
    <div className={styles.reportCampaign}>
      <h5 className={styles.title}>Báo cáo chiến dịch</h5>
      <div className={styles.dates}>
        <div className={styles.selectCampaign}>
          <select onChange={(e) => setCampaignId(e.target.value)}>
            <option value=''>Chọn chiến dịch</option>
            {campaigns &&
              campaigns?.map((cpi, index) => (
                <option
                  key={index}
                  value={cpi?.id}
                >
                  {cpi?.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      {campaignId ? (
        <div className={styles.dates}>
          <div>
            <DatePicker
              locale={vi}
              selected={startDate}
              onChange={(date) => {
                if (endDate - date > 21 * 24 * 60 * 60 * 1000) {
                  toast('Chỉ xử lý được trong khoảng 20 ngày', {
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
                if (date - startDate > 21 * 24 * 60 * 60 * 1000) {
                  toast('Chỉ xử lý được trong khoảng 20 ngày', {
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
      ) : null}
      <div className={styles.statistical}>
        <h4>Thống kê theo chiến dịch</h4>
        <div className={styles.contents}>
          <div className={styles.content}>
            <strong>Tổng hóa đơn</strong>
            <h2>{orders?.length ? orders?.length : 0}</h2>
          </div>
          <div className={styles.content}>
            <strong>Doanh thu</strong>
            <h2>{totalOrder}</h2>
          </div>
          <div className={styles.content}>
            <strong>Bình quân hóa đơn</strong>
            <h2>
              {orders
                ? (orders?.length / totalOrder).toString().slice(0, 6)
                : 0}
            </h2>
          </div>
          <div className={styles.content}>
            <strong>Cuộc gọi đã nhận</strong>
            <h2>{htrCallByCampaign ? htrCallByCampaign?.totalAnswer : 0}</h2>
          </div>
          <div className={styles.content}>
            <strong>Tổng cuộc gọi</strong>
            <h2>{htrCallByCampaign ? htrCallByCampaign?.totalCall : 0}</h2>
          </div>
          <div className={styles.content}>
            <strong>Cuộc gọi đã nhận / Tổng cuộc gọi</strong>
            <h2>
              {htrCallByCampaign &&
                (htrCallByCampaign.totalCall
                  ? htrCallByCampaign.totalAnswer / htrCallByCampaign.totalCall
                  : 0)}
            </h2>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={styles.chart}>
            <h5>Tổng Cuộc Gọi Của</h5>
            <ChartByCampaign htrCall={htrCallByCampaign} />
          </div>
        </div>
      </div>
    </div>
  );
}
