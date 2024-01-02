// Styles
import styles from './StaffManager.module.css';
// Icons
import { AiOutlinePlus, AiFillFileExcel } from 'react-icons/ai';
// Context
import { useAuth } from '../../../../context/AuthContext';
import { useAxios } from '../../../../context/AxiosContex';
import { useSip } from '../../../../context/SipContext';
// Modules
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useState, useRef, useEffect, useCallback } from 'react';
// Functions
import { userNamegroup } from '../../../../utils/functions';
// Components
import { UserData } from '../../../../components/UserData';
import { FormModal } from '../../../../components/FormModal';
import { CallToUser } from '../../../../components/CallToUser';
// hooks
import { useExcel } from '../../../../hooks/useExcel';
import { ExcelData } from '../../../../components/ExcelData';

export default function StaffManager() {
  // data from authcontext
  const { user, brand } = useAuth();
  // navigate
  const { deviceclv } = useSip();
  const [userId, setUserId] = useState();
  const [openFormCall, setOpenFormCall] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [campaignId, setCampaignId] = useState();
  const [customerData, setCustomerData] = useState([]);

  // sort data name
  const groupName = [];
  const groupNamed = [];
  // Apis link
  const {
    getCustomersStaff,
    getCustomer,
    getSource,
    getChannels,
    getLevelUser,
    getcampaigns,
    getCustomersByCapaignId,
  } = useAxios();

  // get levels users
  const { data: levels } = useQuery(['levels', brand], () =>
    getLevelUser(brand),
  );

  // get customers
  const {
    data: customers,
    isLoading,
    refetch,
  } = useQuery(
    ['customers', brand, user?.UserName],
    () =>
      getCustomersStaff({
        brandId: +brand,
        name: user?.UserName,
      }),
    {
      enabled: !!brand,
      cacheTime: 5000,
    },
  );

  useEffect(() => {
    if (customers) {
      setCustomerData(customers);
    }
  }, [customers]);

  const { data: ctm } = useQuery(
    ['ctm', campaignId],
    () => getCustomersByCapaignId(+campaignId),
    {
      enabled: !!campaignId,
    },
  );
  console.log(ctm)
  // get capaigns
  const { data: campaigns } = useQuery(
    ['campaigns', brand],
    () => getcampaigns(+brand),
    { enabled: !!brand },
  );
  // get source
  const { data: source } = useQuery(['source', brand], () => getSource(brand));
  // get channels
  const { data: channels } = useQuery(['channels', brand], () =>
    getChannels(brand),
  );

  // Call to users
  function handleCallToUser({ number, id }) {
    setUserId(id);
    deviceclv?.current.initiateCall(number);
    setOpenFormCall(true);
  }
  const { data: userById } = useQuery(
    ['userCall', userId],
    () => getCustomer(userId),
    { enabled: !!userId },
  );
  // ******* //
  // sort group name data
  const levelIDRef = useRef();
  const sourceIDRef = useRef();
  const channelIDRef = useRef();

  const handleFilter = useCallback(() => {
    const dataAfterFilter = customers
      ?.filter((elm) => {
        if (levelIDRef?.current.value) {
          return +elm?.levelId === +levelIDRef?.current.value;
        }
        return elm;
      })
      .filter((elm) => {
        if (sourceIDRef?.current.value) {
          return +elm?.sourceDataId === +sourceIDRef?.current.value;
        }
        return elm;
      })
      .filter((elm) => {
        if (channelIDRef?.current.value) {
          return +elm?.channelId === +channelIDRef?.current.value;
        }
        return elm;
      });
    setCustomerData(dataAfterFilter);
  }, [customers]);

  customerData?.forEach((elm) => {
    if (elm.firstName) {
      if (ctm) {
        ctm?.forEach((ctmelm) => {
          if (elm.id === ctmelm.id) {
            groupName.push(elm);
          }
        });
      } else {
        groupName.push(elm);
      }
    }
  });

  userNamegroup(groupName)?.forEach((value, index) => {
    groupNamed.push({ key: index, value });
  });
  //hooks
  const [
    handleFile,
    excelFileError,
    excelData,
    setExcelFile,
    setOpenExcel,
    openExcel,
    setExcelData,
  ] = useExcel();
  if (excelFileError) {
    toast(excelFileError, {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }
  return (
    <>
      {openExcel ? (
        <ExcelData
        refetch={refetch}
          setExcelData={setExcelData}
          setOpenExcel={setOpenExcel}
          excelData={excelData}
          setExcelFile={setExcelFile}
        />
      ) : null}
      {openFormCall ? (
        <CallToUser
          user={userById}
          setOpenFormCall={setOpenFormCall}
        />
      ) : null}
      {openModal ? (
        <FormModal
          refetch={refetch}
          setOpenModal={setOpenModal}
        />
      ) : null}
      <div className={styles.campaign}>
        <span>Chiến dịch: </span>
        <select onChange={(e) => setCampaignId(e.target.value)}>
          <option value=''>Tất cả chiến dịch</option>
          {campaigns &&
            campaigns.map((elm, index) => (
              <option
                key={index}
                value={elm.id}
              >
                {elm.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.box__content}>
        <div className={styles.head__box}>
          <h3>Khách hàng</h3>
          <div className={styles.buttons}>
            <button
              onClick={() => setOpenModal(true)}
              className={`${styles.btn__green} ${styles.btn}`}
            >
              <AiOutlinePlus style={{ marginRight: '5px' }} />
              Thêm khách hàng
            </button>

            <label
              className={`${styles.btn__black} ${styles.btn}`}
              id='ulbtn'
              htmlFor='upload-photo'
            >
              <AiFillFileExcel style={{ marginRight: '5px' }} /> Thêm excel
            </label>
            <input
              onChange={handleFile}
              type='file'
              name='photo'
              id='upload-photo'
            />
          </div>
        </div>

        <div className={styles.content}>
          {/* Level khách hàng */}
          <div className={styles.selects}>
            <div>
              <h5>Level khách hàng:</h5>
              <select ref={levelIDRef}>
                <option value=''>Tất cả level</option>
                {levels &&
                  levels.map((elm, index) => {
                    if (elm?.name) {
                      return (
                        <option
                          key={index}
                          value={elm.id}
                        >
                          {elm.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
            {/* Kênh khách hàng */}
            <div>
              <h5>Kênh khách hàng:</h5>
              <select ref={channelIDRef}>
                <option value=''>Tất cả kênh</option>
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

            <div>
              <h5>Nguồn khách hàng:</h5>
              <select ref={sourceIDRef}>
                <option value=''>Tất cả nguồn</option>
                {source &&
                  source.map((sr, index) => {
                    if (sr?.name) {
                      return (
                        <option
                          key={index}
                          value={sr.id}
                        >
                          {sr.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
          </div>
          <div className={styles.select__btn}>
            <button
              onClick={handleFilter}
              className={`${styles.btn} ${styles.btn__filter}`}
            >
              Lọc
            </button>
          </div>
          {/* Data user */}
          <div className={styles.table}>
            <UserData
              handleCallToUser={handleCallToUser}
              isLoading={isLoading}
              groupNamed={groupNamed}
            />
          </div>
        </div>
      </div>
    </>
  );
}
