// Styles
import './AddProduct.css';
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
import { useAuth } from '../../../context/AuthContext';
//functions
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export function AddProduct({ refetch, setOpenModal }) {
  const { createProduct, getProductCategories } = useAxios();
  const { brand } = useAuth();
  const [name, setName] = useState('');
  const [oldPrice, setOldPrice] = useState();
  const [price, setPrice] = useState();
  const [contents, setContents] = useState();
  const [description, setDescription] = useState();
  const categoryRef = useRef();
  const { data: listview } = useQuery(
    ['getprdctgr', brand],
    () => getProductCategories(brand),
    {
      enabled: !!brand,
    },
  );
  const createProductMutation = useMutation({
    mutationFn: (data) => {
      return createProduct(data).then((res) => {
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

  function handleCreateProduct(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      description: description,
      price: price,
      oldPrice: oldPrice,
      productCategoryId: categoryRef.current?.value,
      status: 0,
      contents: contents,
    };
    if (
      !name ||
      !oldPrice ||
      !description ||
      !price ||
      !contents ||
      !categoryRef.current?.value
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
    createProductMutation.mutate(dataPost);
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
          <h6>Tạo sản phẩm</h6>
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
              <label>Chi tiết</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type='text'
              />
            </div>
            <div className='field'>
              <label>Giá</label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type='number'
              />
            </div>
          </div>
          <div className='field'>
            <label>Giá cũ</label>
            <Input
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              type='number'
            />
          </div>
          <div className='field'>
            <label>Nội dung</label>
            <Input
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              type='text'
            />
          </div>
          <div className='field'>
            <label>Chọn danh mục</label>
            <select ref={categoryRef}>
              <option value=''>Chọn danh mục</option>
              {listview &&
                listview.map((elm, index) => (
                  <option
                    key={index}
                    value={elm.id}
                  >
                    {elm.name}
                  </option>
                ))}
            </select>
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
              onClick={handleCreateProduct}
              className='addbtn'
            >
              Tạo sản phẩm
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
