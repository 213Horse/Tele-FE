// Styles
import './EditCategory.css';
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

export function EditCategory({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { getCategoryById, editCategory } = useAxios();
  const { brand } = useAuth();
  const { data: categoryID } = useQuery(
    ['getCategoryID', idEdit],
    () => getCategoryById(+idEdit),
    { enabled: !!idEdit },
  );

  useEffect(() => {
    if (categoryID) {
      setName(categoryID?.name);
      setDescription(categoryID?.description);
    }
  }, [categoryID]);

  const updateCategoryMutation = useMutation({
    mutationFn: (data) => {
      return editCategory(data).then((res) => {
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
  function handleUpdateCategory(e) {
    e.preventDefault();
    const dataPatch = {
      name: name,
      description: description,
      status: 0,
      brandId: brand,
    };
    if (!name || !description) {
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
    updateCategoryMutation.mutate({ id: idEdit, data: dataPatch });
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
          <h6>Sửa danh mục</h6>
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

          <div className='field'>
            <label>Chi tiết</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              onClick={handleUpdateCategory}
              className='addbtn'
            >
              Sửa danh mục
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
