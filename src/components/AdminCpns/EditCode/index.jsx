import styles from './EditCode.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from '../../Button';
import { motion } from 'framer-motion';
import { Input } from '../../Input';
import { useAxios } from '../../../context/AxiosContex';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

export function EditCode({ refetch, idCode, setOpenModal }) {
  const { updateUser, getUserById } = useAxios();
  const userNameRef = useRef();
  const dfNameRef = useRef();
  const passwordRef = useRef();

  const { data } = useQuery(
    ['getUserById', idCode],
    () => getUserById(idCode),
    { enabled: !!idCode },
  );
  console.log(data);
  const editUserMutation = useMutation({
    mutationFn: (data) => {
      return updateUser(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        refetch();
        toast('Update thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setOpenModal(false);
      }
    },
  });
  function handleUpdateUser(e) {
    e.preventDefault();
    const dataPost = {
      firstName: data?.user.firstName,
      lastName: data?.user.lastName,
      address: data?.user.address,
      status: data?.user.status,
      gender: data?.user.gender,
      roleId: data?.user.roleId,
      dateOfBirth: data?.user.dateOfBirth,
      email: data?.user.email,
      password: passwordRef.current?.value,
      phoneNumber: data?.user.phoneNumber,
      userName: userNameRef.current?.value || '',
      cfdisplayName: data?.user.cfdisplayName,
      cfusername: dfNameRef.current?.value,
      cfpassword: data?.user.cfpassword || '',
    };
    if (
      !userNameRef.current?.value ||
      !dfNameRef.current?.value ||
      !passwordRef.current?.value
    ) {
      toast('Không được bỏ trống mục nào', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    editUserMutation.mutate({ id: idCode, data: dataPost });
  }

  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className={styles.editWork}
    >
      <form>
        <div className={styles.head}>
          <h6>Đổi máy nhánh</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.field}>
            <label>Tên hiển thị:</label>
            <Input
              ref={userNameRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Máy nhánh:</label>
            <Input
              ref={dfNameRef}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Mật khẩu:</label>
            <Input
              ref={passwordRef}
              type='text'
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => setOpenModal(false)}
            className={styles.cancelbtn}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdateUser}
            className={styles.addbtn}
          >
            Thay đổi
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
