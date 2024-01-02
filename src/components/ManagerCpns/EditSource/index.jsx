// Styles
import './EditSource.css';
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

export function EditSource({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { brand } = useAuth();

  const { getSourceById, editSource } = useAxios();
  const { data: getSourceId } = useQuery(
    ['getSourceById', idEdit],
    () => getSourceById(+idEdit),
    { enabled: !!idEdit },
  );
  useEffect(() => {
    if (getSourceId) {
      setName(getSourceId.name);
      setTitle(getSourceId.title);
      setDescription(getSourceId.description);
    }
  }, [getSourceId]);

  const updateSourceMutation = useMutation({
    mutationFn: (data) => {
      return editSource(data).then((res) => {
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
  function handleUpdateSource(e) {
    e.preventDefault();
    const dataPatch = {
      name: name,
      title: title,
      description: description,
      status: 0,
      brandId: brand,
    };
    if (!name || !title || !description) {
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
    updateSourceMutation.mutate({ id: idEdit, data: dataPatch });
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
                setEditModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateSource}
              className='addbtn'
            >
              Sửa
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
