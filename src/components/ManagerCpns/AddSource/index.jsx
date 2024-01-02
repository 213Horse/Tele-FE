// Styles
import './AddSource.css';
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

export function AddSource({ refetch, setOpenModal }) {
  const { createSource } = useAxios();
  const { brand } = useAuth();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createSourceMutation = useMutation({
    mutationFn: (data) => {
      return createSource(data).then((res) => {
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

  function handleCreateSource(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      title: title,
      description: description,
      status: 0,
      brandId: brand,
    };
    if (!name || !name || !title || !description) {
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
    createSourceMutation.mutate(dataPost);
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
          <h6>Tạo nguồn</h6>
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
              <label>Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type='text'
              />
            </div>
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
              onClick={handleCreateSource}
              className='addbtn'
            >
              Tạo nguồn
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
