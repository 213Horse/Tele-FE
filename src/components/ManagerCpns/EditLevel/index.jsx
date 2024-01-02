// Styles
import './EditLevel.css';
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
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditLevel({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [note, setNote] = useState('');
  const brandRef = useRef();
  const { getLevelById, editLevelById, getBrands } = useAxios();
  const { data: getLevelId } = useQuery(
    ['getlevelbyid', idEdit],
    () => getLevelById(+idEdit),
    { enabled: !!idEdit },
  );
  const { data: brands } = useQuery(['getbrands'], getBrands);

  useEffect(() => {
    if (getLevelId) {
      setName(getLevelId?.name);
      setCode(getLevelId?.code);
      setNote(getLevelId?.note);
    }
  }, [getLevelId]);
  //* update brand mutations
  const updateLevelMutation = useMutation({
    mutationFn: (data) => {
      return editLevelById(data).then((res) => {
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
  function handleUpdateUser(e) {
    e.preventDefault();
    const dataPatch = {
      name: name,
      code: code,
      note: note,
      status: 0,
      brandId: brandRef.current?.value,
    };
    if (!name || !code || !note || !brandRef.current?.value) {
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
    updateLevelMutation.mutate({ id: idEdit, data: dataPatch });
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
          <h6>Sửa level</h6>
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
                      selected={getLevelId?.brandId === brand.id}
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
                setEditModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateUser}
              className='addbtn'
            >
              Sửa levels
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
