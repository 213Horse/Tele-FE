// Styles
import './EditProduct.css';
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
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditProduct({ refetch, idEdit, setEditModal }) {
  const [name, setName] = useState('');
  const [oldPrice, setOldPrice] = useState();
  const [price, setPrice] = useState();
  const [contents, setContents] = useState();
  const [description, setDescription] = useState();
  const categoryRef = useRef();

  const { brand } = useAuth();

  const { getProductById, editProduct, getProductCategories } = useAxios();
  const { data: productId } = useQuery(
    ['getProductByid', idEdit],
    () => getProductById(+idEdit),
    { enabled: !!idEdit },
  );
  console.log(productId)
  const { data: listview } = useQuery(
    ['getprdctgr', brand],
    () => getProductCategories(brand),
    {
      enabled: !!brand,
    },
  );
  console.log(productId)
  useEffect(() => {
    if (productId) {
      setName(productId.name);
      setOldPrice(productId.oldPrice);
      setContents(productId.contents);
      setDescription(productId.description);
      setPrice(productId.price);
    }
  }, [productId]);

  const updateProductMutation = useMutation({
    mutationFn: (data) => {
      return editProduct(data).then((res) => {
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
      description: description,
      price: price,
      oldPrice: oldPrice,
      productCategoryId: categoryRef.current?.value,
      status: 0,
      contents: contents,
    };
    if (
      !name ||
      !price ||
      !description ||
      !oldPrice ||
      !contents ||
      !categoryRef?.current.value
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
    updateProductMutation.mutate({ id: idEdit, data: dataPatch });
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
