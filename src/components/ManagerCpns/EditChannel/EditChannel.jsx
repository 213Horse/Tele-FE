// Styles
import './EditChannel.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import { useAxios } from '../../../context/AxiosContex';
import { useAuth } from '../../../context/AuthContext';
//functions
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditChannel({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [revenueForecast, setRevenueForecast] = useState('');
  const [costExcepted, setCostExcepted] = useState('');

  const { getChannelById, editChannel } = useAxios();
  const { brand } = useAuth();
  const { data: channels } = useQuery(
    ['channels', idEdit],
    () => getChannelById(+idEdit),
    { enabled: !!idEdit },
  );

  useEffect(() => {
    if (channels) {
      setName(channels?.name);
      setCode(channels?.code);
      setTitle(channels?.title);
    }
  }, [channels]);

  const updateChannelMutation = useMutation({
    mutationFn: (data) => {
      return editChannel(data).then((res) => {
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
  function handleUpdateChannel(e) {
    e.preventDefault();
    const dataPatch = {
      name: name,
      code: code,
      title: title,
      status: 0,
      revenueForecast: revenueForecast,
      costExcepted: costExcepted,
      brandId: brand,
    };
    if (!name || !code || !title || !revenueForecast || !costExcepted) {
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
    updateChannelMutation.mutate({ id: idEdit, data: dataPatch });
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
          <h6>Sửa kênh</h6>
          <AiOutlineClose
            onClick={() => setEditModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className='fields'>
          <div className='field'>
            <label>Tên kênh</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
            />
          </div>

          <div className='flex'>
            <div className='field'>
              <label>Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Tiêu đề</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'
              />
            </div>
          </div>
          <div className='field'>
            <label>Dự đoán thu nhật</label>
            <Input
              value={revenueForecast}
              onChange={(e) => setRevenueForecast(e.target.value)}
              type='number'
            />
          </div>
          <div className='field'>
            <label>Chi phí</label>
            <Input
              value={costExcepted}
              onChange={(e) => setCostExcepted(e.target.value)}
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
              onClick={handleUpdateChannel}
              className='addbtn'
            >
              Sửa kênh
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
