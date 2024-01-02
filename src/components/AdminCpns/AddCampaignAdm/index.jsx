// Styles
import styles from './AddCampaignAdm.module.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
// Components
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
// Context
import { useAxios } from '../../../context/AxiosContex';
// Modules
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export function AddCampaignAdm({ setOpenModal, refetch }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const { createBrand } = useAxios();

  const createBrandMutation = useMutation({
    mutationFn: (data) => {
      return createBrand(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      console.log(data);
      if (data?.status === 'Success') {
        refetch();
        toast('Tạo thương hiệu thành công', {
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

  function handleCreateBrand(e) {
    e.preventDefault();
    const dataPost = {
      name: name,
      status: 0,
      address: address,
      description: description,
      code: code,
      managerName: manager,
      phoneContact: phone,
      email: email,
      website: website,
    };
    if (
      !name ||
      !address ||
      !description ||
      !code ||
      !manager ||
      !phone ||
      !email ||
      !website
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
    createBrandMutation.mutate(dataPost);
  }
  return (
    <motion.div
      initial={{ opacity: 0, transition: 0.5 }}
      animate={{ opacity: 1, transition: 0.5 }}
      transition={{ type: 'spring' }}
      className={styles.formmoal}
    >
      <form>
        <div className={styles.head}>
          <h6>Thêm Thương hiệu</h6>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Brand name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Manager</label>
            <Input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type='text'
            />
          </div>

          <div className={styles.flex}>
            <div className={styles.field}>
              <label>Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
              />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type='text'
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Website</label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows='3'
            ></textarea>
          </div>
          <div className={styles.buttons}>
            <Button
              className={styles.cancelbtn}
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateBrand}
              className={styles.addbtn}
            >
              Thêm thương hiệu
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
