// styles
import styles from './CallToUser.module.css';
// Components
import { Input } from '../../Input';
import { Button } from '../../Button';
// Modules
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
// context
import { useAuth } from '../../../context/AuthContext';

// functions
import { formatNumber, toHoursAndMinutes } from '../../../utils/functions';

export function CallToUser({
  deviceclv,
  rejectStt,
  setOpenFormCall,
  setRejectStt,
}) {
  //* Dữ liệu từ socket
  const { dataAfterParse, setDataCalled, setDataAfterParse } = useAuth();
  //* Trạng thái gọi

  //* Tắt cuộc gọi
  function rejectCall() {
    deviceclv?.current.reject();
    toast('Cuộc gọi đã kết thúc', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  //* Hủy, quay về
  function cancelCall() {
    setRejectStt();
    setDataCalled(null);
    setDataAfterParse(null);
    setOpenFormCall(false);
    toast('Hủy cuộc gọi thành công', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    deviceclv?.current.reject();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring' }}
        className={styles.formmoal}
      >
        <div className={styles.wrapf}>
          <div className={styles.form}>
            <div className={styles.head}>
              <h6>Đang gọi đến nhân viên</h6>
            </div>
            <div className={styles.fields}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                <span>
                  Số điện thoại:{' '}
                  {dataAfterParse?.ReceiptNumber
                    ? formatNumber(dataAfterParse?.ReceiptNumber)
                    : ''}
                </span>
              </div>
              <div className={styles.field}>
                <label>Thời gian gọi</label>
                <Input
                  disabled
                  value={
                    dataAfterParse?.Data?.TotalTimeCall
                      ? toHoursAndMinutes(dataAfterParse?.Data?.TotalTimeCall)
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Trạng thái gọi</label>
                <Input
                  disabled
                  value={
                    dataAfterParse
                      ? dataAfterParse?.Status === 'Up_Out'
                        ? 'Đang nói chuyện'
                        : dataAfterParse?.Status === 'Down_Out'
                        ? 'Đã tắt máy'
                        : rejectStt === 11
                        ? 'Khách hàng bận'
                        : rejectStt === 12
                        ? 'Tự hủy'
                        : 'Đang đổ chuông'
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.field}>
                <label>Thực gọi</label>
                <Input
                  disabled
                  value={
                    dataAfterParse?.Data?.RealTimeCall
                      ? toHoursAndMinutes(dataAfterParse?.Data?.RealTimeCall)
                      : ''
                  }
                  type='text'
                />
              </div>
              <div className={styles.order}>
                <Button
                  className={styles.btn__calto}
                  onClick={rejectCall}
                >
                  Tắt máy
                </Button>
                <Button
                  className={styles.btn__calto}
                  onClick={cancelCall}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
