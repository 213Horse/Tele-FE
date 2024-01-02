// Styles
import styles from './EditCampaignAdm.module.css';
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
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditCampaignAdm({ idBrand, setEditModal }) {
  const { getBrandById, updateBrand } = useAxios();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const { data: getBrandId } = useQuery(
    ['getbrandbyid', idBrand],
    () => getBrandById(idBrand),
    { enabled: !!idBrand },
  );

  useEffect(() => {
    if (getBrandId) {
      setCode(getBrandId.code);
      setName(getBrandId.name);
      setManager(getBrandId.managerName);
      setEmail(getBrandId.email);
      setPhone(getBrandId.phoneContact);
      setWebsite(getBrandId.website);
      setAddress(getBrandId.address);
      setDescription(getBrandId.description);
    }
  }, [getBrandId]);

  //* update brand mutations
  const updateBrandMutation = useMutation({
    mutationFn: (data) => {
      return updateBrand(data).then((res) => {
        return res;
      });
    },
    onSuccess(data) {
      console.log(data);
      if (data?.status === 'Success') {
        toast('Update thành công', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setEditModal(false);
      }
    },
  });
  function handleUpdateBrand(e) {
    e.preventDefault();
    const dataPatch = {
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
    updateBrandMutation.mutate({ id: getBrandId.id, data: dataPatch });
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
          <h6>Sửa Thương hiệu</h6>
          <AiOutlineClose
            onClick={() => setEditModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Code</label>
            <Input
              onChange={(e) => setCode(e.target.value)}
              type='text'
              value={code}
            />
          </div>
          <div className={styles.field}>
            <label>Brand name</label>
            <Input
              onChange={(e) => setName(e.target.value)}
              type='text'
              value={name}
            />
          </div>
          <div className={styles.field}>
            <label>Manager</label>
            <Input
              onChange={(e) => setManager(e.target.value)}
              value={manager}
              type='text'
            />
          </div>
          <div className={styles.field}>
            <label>Address</label>
            <Input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type='text'
            />
          </div>

          <div className={styles.flex}>
            <div className={styles.field}>
              <label>Email</label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='email'
              />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <Input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                type='text'
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Website</label>
            <Input
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
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
                setEditModal(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateBrand}
              className={styles.addbtn}
            >
              Sửa thương hiệu
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
