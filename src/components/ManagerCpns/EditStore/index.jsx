// Styles
import './EditStore.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../Input';
import { Button } from '../../Button';
import { useQuery, useMutation } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import { useAxios } from '../../../context/AxiosContex';
import { useAuth } from '../../../context/AuthContext';
//functions
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditStore({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const { brand } = useAuth();

  const { getStoresById, updateStores } = useAxios();
  const { data: getStoreId } = useQuery(
    ['getStoresById', idEdit],
    () => getStoresById(+idEdit),
    { enabled: !!idEdit },
  );
  useEffect(() => {
    if (getStoreId) {
      setName(getStoreId.name);
      setAddress(getStoreId.address);
      setPhoneNumber(getStoreId.phoneNumber);
      setEmail(getStoreId.email);
    }
  }, [getStoreId]);

  const updateStoreMutation = useMutation({
    mutationFn: (data) => {
      return updateStores(data).then((res) => {
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
        refetch();
        setEditModal(false);
      }
    },
  });
  function handleUpdateStore(e) {
    e.preventDefault();
    const dataPatch = {
      name: name,
      status: 0,
      address: address,
      email: email,
      phoneNumber: phoneNumber,
      brandId: brand,
    };
    if (!name || !address || !email || !phoneNumber) {
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
    updateStoreMutation.mutate({ id: idEdit, data: dataPatch });
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
          <h6>Sửa chi nhánh</h6>
          <AiOutlineClose
            onClick={() => setEditModal(false)}
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
                type='text'
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
                setEditModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStore}
              className='addbtn'
            >
              Sửa chi nhánh
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
