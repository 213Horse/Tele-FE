// Styles
import './EditCampaign.css';
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
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';
//functions
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function EditCampaign({ refetch, idEdit, setEditModal }) {
  const { getCampaignById, editCampaign } = useAxios();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { brand } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [costReal, setCostReal] = useState();
  const [costExpect, setCostExpect] = useState();
  const [code, setCode] = useState();
  const [revenueExpect, setRevenueExpect] = useState();
  const { data: campaignId } = useQuery(
    ['getCampaignById', idEdit],
    () => getCampaignById(+idEdit),
    { enabled: !!idEdit },
  );
  useEffect(() => {
    if (campaignId) {
      setRevenueExpect(campaignId?.revenueExpect);
      setCostReal(campaignId?.costReal);
      setCostExpect(campaignId?.costExpect);
      setName(campaignId?.name);
      setDescription(campaignId?.descriptions);
      setCode(campaignId?.code);
    }
  }, [campaignId]);

  const updateCampaignMutation = useMutation({
    mutationFn: (data) => {
      return editCampaign(data).then((res) => {
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
      brandId: brand,
      name: name,
      type: 0,
      status: 0,
      startDate: new Date(new Date(startDate).getTime()),
      expiredDate: new Date(new Date(endDate).getTime()),
      descriptions: description,
      costReal: costReal,
      costExpect: costExpect,
      revenueExpect: revenueExpect,
      code: code,
    };
    if (
      !name ||
      !description ||
      !costReal ||
      !costExpect ||
      !code ||
      !revenueExpect
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
    updateCampaignMutation.mutate({ id: idEdit, data: dataPatch });
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
          <h6>Sửa chiến dịch</h6>
          <AiOutlineClose
            onClick={() => setEditModal(false)}
            style={{ color: 'grey', fontSize: '20px', cursor: 'pointer' }}
          />
        </div>
        <div className='fields'>
          <div className='flex'>
            <div className='field'>
              <label>Start Date</label>
              <DatePicker
                locale={vi}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className='field'>
              <label>End Date</label>
              <DatePicker
                locale={vi}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
          </div>
          <div className='field'>
            <label>Code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type='text'
            />
          </div>

          <div className='field'>
            <label>Campaign name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <div className='field'>
            <label>Actual cost</label>
            <Input
              value={costReal}
              onChange={(e) => setCostReal(e.target.value)}
              type='number'
            />
          </div>
          <div className='field'>
            <label>Expected cost</label>
            <Input
              value={costExpect}
              onChange={(e) => setCostExpect(e.target.value)}
              type='number'
            />
          </div>
          <div className='field'>
            <label>Revenue expected</label>
            <Input
              value={revenueExpect}
              onChange={(e) => setRevenueExpect(e.target.value)}
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
              onClick={handleUpdateCategory}
              className='addbtn'
            >
              Sửa chiến dịch
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
