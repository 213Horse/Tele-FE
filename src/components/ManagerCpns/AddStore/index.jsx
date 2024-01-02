// Styles
import './AddStore.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useMutation } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';
import { useAxios } from '../../../context/AxiosContex';
import { useAuth } from '../../../context/AuthContext';
//functions
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function AddStore({ refetch, setOpenModal }) {
  const { postStores } = useAxios();
  const { brand } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const createStoreMutation = useMutation({
    mutationFn: (data) => {
      return postStores(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        refetch();
        toast('Tạo level thành công', {
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

  function handleUpdateStore(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      status: 0,
      address: address,
      email: email,
      phoneNumber: phoneNumber,
      brandId: brand,
    };
    if (!name || !name || !address || !phoneNumber) {
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
    createStoreMutation.mutate(dataPost);
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
          <h6>Tạo chi nhánh</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className='fields'>
          <div className='field'>
            <label>Tên</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
            />
          </div>

          <div className='flex'>
            <div className='field'>
              <label>Địa chỉ</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
          </div>
          <div className='field'>
            <label>Số điện thoại</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type='number'
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
              onClick={handleUpdateStore}
              className='addbtn'
            >
              Tạo chi nhánh
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
