// Styles
import './EditUserModal.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import { useAxios } from '../../../context/AxiosContex';
//functions
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditUserModal({ idEdit, setEditModal }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { getUserById, updateUserById } = useAxios();
  const { data: getUserid } = useQuery(
    ['getbrandbyid', idEdit],
    () => getUserById(idEdit),
    { enabled: !!idEdit },
  );

  useEffect(() => {
    if (getUserid) {
      setUserName(getUserid?.user.userName);
      setFirstName(getUserid?.user.firstName);
      setLastName(getUserid?.user.lastName);
      setAddress(getUserid?.user.address);
      setPhone(getUserid?.user.phoneNumber);
      setEmail(getUserid?.user.email);
    }
  }, [getUserid]);
  //* update brand mutations
  const updateUserMutation = useMutation({
    mutationFn: (data) => {
      return updateUserById(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        toast('Update thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setEditModal(false);
      }
    },
  });
  function handleUpdateUser(e) {
    e.preventDefault();
    const dataPatch = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      status: 0,
      gender: getUserid?.user.gender,
      roleId: getUserid?.user.roleId,
      dateOfBirth: getUserid?.user.dateOfBirth,
      email: email,
      password: password,
      phoneNumber: phone,
      userName: userName,
      cfdisplayName: getUserid?.user.cfdisplayName,
      cfusername: getUserid?.user.cfusername,
      cfpassword: getUserid?.user.cfpassword,
    };
    if (
      !userName ||
      !address ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !email
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
    updateUserMutation.mutate({ id: idEdit, data: dataPatch });
  }
  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className='formmoal'
    >
      <form>
        <div className='head'>
          <h6>Sửa người dùng</h6>
          <AiOutlineClose
            onClick={() => setEditModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className='fields'>
          <div className='field'>
            <label>Tên đăng nhập</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type='text'
            />
          </div>
          <div className='field'>
            <label>Mật khẩu</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='text'
            />
          </div>

          <div className='field'>
            <label>Địa chỉ</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type='text'
            />
          </div>

          <div className='flex'>
            <div className='field'>
              <label>Họ</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Tên</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type='text'
              />
            </div>
          </div>
          <div className='field'>
            <label>Điện thoại</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
            />
          </div>
          <div className='field'>
            <label>Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
            />
          </div>
          <div className='buttons'>
            <Button
              className='cancelbtn'
              onClick={(e) => {
                e.preventDefault();
                setEditModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateUser}
              className='addbtn'
            >
              Sửa người dùng
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
