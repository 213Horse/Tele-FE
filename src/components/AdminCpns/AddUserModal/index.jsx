// Styles
import './AddUserModal.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useMutation } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import vi from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useAxios } from '../../../context/AxiosContex';
//functions
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function AddUserModal({ refetch, setOpenModal }) {
  const { addUser } = useAxios();
  const [startDate, setStartDate] = useState(new Date());
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const createUserMutation = useMutation({
    mutationFn: (data) => {
      return addUser(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      console.log(data);
      if (data?.status === 'Success') {
        refetch();
        toast('Tạo người dùng thành công', {
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

  function handleCreateUser(e) {
    e.preventDefault();
    const dataPost = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      status: 0,
      gender: +gender,
      roleId: +role,
      dateOfBirth: new Date(new Date(startDate).getTime()),
      email: email,
      password: password,
      phoneNumber: phone,
      userName: name,
      cfdisplayName: '',
      cfusername: '',
      cfpassword: '',
    };
    if (
      !firstName ||
      !lastName ||
      !address ||
      !gender ||
      !role ||
      !phone ||
      !email ||
      !startDate ||
      !name ||
      !password
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
    createUserMutation.mutate(dataPost);
  }
  let handleColor = (time) => {
    return time.getHours() > 12 ? 'text-success' : 'text-error';
  };
  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className='formmoal'
    >
      <form>
        <div className='head'>
          <h6>Thêm người dùng</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className='fields'>
          <div className='field'>
            <label>Tên đăng nhập</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label>Chúc vụ</label>
            <select onChange={(e) => setRole(e.target.value)}>
              <option value=''>Chọn chức vụ</option>
              <option value='1'>Nhân viên</option>
              <option value='2'>Quản lý</option>
            </select>
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
          <div className='flex'>
            <div className='field'>
              <label>Giới tính</label>
              <select onChange={(e) => setGender(e.target.value)}>
                <option value=''>Chọn giới tính</option>
                <option value='1'>Nam</option>
                <option value='0'>Nữ</option>
              </select>
            </div>
            <div className='field'>
              <label>Ngày sinh</label>
              <DatePicker
                locale={vi}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                timeClassName={handleColor}
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
              type='email'
            />
          </div>
          <div className='buttons'>
            <Button
              className='cancelbtn'
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateUser}
              className='addbtn'
            >
              Thêm người dùng
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
