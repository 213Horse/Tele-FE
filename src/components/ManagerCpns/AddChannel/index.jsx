// Styles
import './AddChannel.css';
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

export function AddChannel({ refetch, setOpenModal }) {
  const { createChannel } = useAxios();
  const { brand } = useAuth();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [revenueForecast, setRevenueForecast] = useState('');
  const [costExcepted, setCostExcepted] = useState('');

  const createChannelMutation = useMutation({
    mutationFn: (data) => {
      return createChannel(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      if (data?.status === 'Success') {
        refetch();
        toast('Tạo channel thành công', {
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

  function handleCreateChannel(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      code: code,
      title: title,
      status: 0,
      revenueForecast: revenueForecast,
      costExcepted: costExcepted,
      brandId: brand,
    };
    if (!name || !title || !code || !revenueForecast || !costExcepted) {
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
    createChannelMutation.mutate(dataPost);
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
          <h6>Tạo kênh</h6>
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
              <label>Tiêu đề</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type='text'
              />
            </div>
          </div>
          <div className='field'>
            <label>Chi phí</label>
            <Input
              value={costExcepted}
              onChange={(e) => setCostExcepted(e.target.value)}
              type='number'
            />
          </div>
          <div className='field'>
            <label>Dự đoán thu nhập</label>
            <Input
              value={revenueForecast}
              onChange={(e) => setRevenueForecast(e.target.value)}
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
              onClick={handleCreateChannel}
              className='addbtn'
            >
              Tạo kênh
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
