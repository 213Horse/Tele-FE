import styles from './ExcelData.module.css';
import { Button } from '../Button';
import { toast } from 'react-hot-toast';
import v2 from '../../assets/v2.png';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useAxios } from '../../context/AxiosContex';
import { ExcelDateToJSDate, formatNumber } from '../../utils/functions';
import { useRef } from 'react';
export function ExcelData({refetch, setOpenExcel, excelData, setExcelFile }) {
  //* Link api
  const { getSource, getChannels, getLevelUser, getcampaigns, postCustomer } =
    useAxios();
  //* Data từ context
  const { brand, user } = useAuth();
  //* Lấy tất cả levels khách
  const { data: levels } = useQuery(
    ['levels', brand],
    () => getLevelUser(brand),
    {
      enabled: !!brand,
    },
  );

  //* Lấy tất cả chiến dịch
  const { data: campaigns } = useQuery(
    ['campaigns', brand],
    () => getcampaigns(+brand),
    { enabled: !!brand },
  );
  //* Lấy source theo brand ID
  const { data: source } = useQuery(['source', brand], () => getSource(brand));
  //* Lấy kênh
  const { data: channels } = useQuery(['channels', brand], () =>
    getChannels(brand),
  );
  if (!excelData.length) {
    setExcelFile(null);
    toast('Không có dữ liệu', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    return;
  }
  const levelRef = useRef();
  const channelRef = useRef();
  const sourceRef = useRef();
  const capaignRef = useRef();
  //* Mutatuion tạo khách hàng
  const postCustomerMutation = useMutation({
    mutationFn: (data) => {
      return postCustomer(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data.status == 'Fail') {
        toast('Quá trình thêm bị lỗi', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return;
      }
    },
  });
  function handleAddAll() {
    const requests = [];
    for (const field of excelData) {
      const data = {
        firstName: field.firstName,
        lastName: field.lastName,
        phoneNumber: field.phoneNumber,
        email: field.email,
        address: field.address,
        dayOfBith: '2023-03-15T09:27:08.140Z',
        gender: field.gender,
        status: 0,
        channelId: +channelRef.current?.value,
        levelId: +levelRef.current?.value,
        userId: +user.Id,
        sourceDataId: +sourceRef.current?.value,
      };
      requests.push({
        data,
        CampaignId: capaignRef.current?.value,
      });
    }
    Promise.allSettled(
      requests.map(async (us) => {
        try {
          await postCustomerMutation.mutate(us);
        } catch (err) {
          console.error(`I'm down, this time. ${err}`);
        }
      }),
    ).then(() => {
      refetch();
      setExcelFile(null);
      setOpenExcel(false);
      toast('Thêm thành công', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    });
  }
  const fields = [
    'firstName',
    'lastName',
    'phoneNumber',
    'email',
    'address',
    'dayOfBith',
    'gender',
  ];
  let content;
  Object.keys(excelData[0]).map((elm) => {
    if (!fields.includes(elm)) {
      content = (
        <>
          <div className={styles.excelData}>
            <div className={styles.contentExcel}>
              <h5>Các trường không hợp lệ</h5>
              <span>Hãy nhập cột theo mẫu sau</span>
              <img
                src={v2}
                alt='v2'
              />
              <div className={styles.buttons}>
                <Button
                  className={styles.cancelbtn}
                  onClick={(e) => {
                    e.preventDefault();
                    setExcelFile(null);
                    setOpenExcel(false);
                  }}
                >
                  Thoát
                </Button>
              </div>
            </div>
          </div>
        </>
      );
      return;
    }
    content = (
      <div className={styles.excelData}>
        <div className={styles.contentExcel}>
          <h5>
            Tất cả dữ liệu từ excel{' '}
            <span>
              ( Vui lòng đẩy lên dữ liệu chỉ có các cột STT, firstName,lastName,
              phoneNumber, email, address, dayOfBith, gender )
              <strong style={{ display: 'block', marginTop: '15px' }}>
                Lưu ý không được bỏ trống mục nào để tránh lỗi xảy ra khi upload
              </strong>
            </span>
          </h5>
          <div className={styles.selects}>
            <div className={styles.field}>
              <label>Level</label>
              <select ref={levelRef}>
                {levels &&
                  levels.map((lv, index) => {
                    if (lv?.name) {
                      return (
                        <option
                          key={index}
                          value={lv.id}
                        >
                          {lv.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
            <div className={styles.field}>
              <label>Kênh KH</label>
              <select ref={channelRef}>
                {channels &&
                  channels.map((cn, index) => (
                    <option
                      key={index}
                      value={cn.id}
                    >
                      {cn.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Nguồn KH</label>
              <select ref={sourceRef}>
                {source &&
                  source.map((sor, index) => (
                    <option
                      key={index}
                      value={sor.id}
                    >
                      {sor.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Chiến dịch</label>
              <select ref={capaignRef}>
                {campaigns &&
                  campaigns.map((cp, index) => (
                    <option
                      key={index}
                      value={cp.id}
                    >
                      {cp.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className={styles.data}>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ</th>
                  <th>Tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                </tr>
              </thead>
              <tbody>
                {excelData &&
                  excelData.map((elm, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{elm.firstName}</td>
                      <td>{elm.lastName}</td>
                      <td>
                        {elm.phoneNumber ? formatNumber(elm.phoneNumber) : ''}
                      </td>
                      <td>{elm.email}</td>
                      <td>{elm.address}</td>
                      <td>
                        {elm.dayOfBith ? ExcelDateToJSDate(elm.dayOfBith) : ''}
                      </td>
                      <td>{elm.gender == '0' ? 'Nữ' : 'Nam'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={styles.buttons}>
            <Button
              className={styles.cancelbtn}
              onClick={(e) => {
                e.preventDefault();
                setExcelFile(null);
                setOpenExcel(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddAll}
              className={styles.cancelbtn2}
            >
              Thêm tất cả
            </Button>
          </div>
        </div>
      </div>
    );
  });
  return content;
}
