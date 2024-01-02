// Styles
import './AddLevel.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useMutation, useQuery } from '@tanstack/react-query';
// Modules
import { motion } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';
import { useAxios } from '../../../context/AxiosContex';
//functions
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export function AddLevel({ refetch, setOpenModal }) {
  const { postLevel, getBrands } = useAxios();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [note, setNote] = useState('');
  const { data: brands } = useQuery(['getbrands'], getBrands);
  const brandRef = useRef();

  const createLevelMutation = useMutation({
    mutationFn: (data) => {
      return postLevel(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      console.log(data);
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

  function handleUpdateLevel(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      code: note,
      note: code,
      status: 0,
      brandId: brandRef.current?.value,
    };
    if (!name || !note || !code || !brandRef.current?.value) {
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
    createLevelMutation.mutate(dataPost);
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
          <h6>Tạo level</h6>
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
              <label>Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Nhãn hiệu</label>
              <select ref={brandRef}>
                <option value=''>Chọn thương hiệu</option>
                {brands &&
                  brands.map((brand, index) => (
                    <option
                      key={index}
                      value={brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className='field'>
            <label>Note</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type='text'
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
              onClick={handleUpdateLevel}
              className='addbtn'
            >
              Tạo levels
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
