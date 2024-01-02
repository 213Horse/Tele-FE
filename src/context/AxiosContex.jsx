// modules
import { createContext, useContext, useMemo } from 'react';
import Axios from 'axios';
// ENV
import { REACT_URL } from '../utils/ENV';

// Axios context
const AxiosContext = createContext();

export default function AxiosProvider({ children }) {
  const axios = useMemo(() => {
    //? interceptors axios
    const axios = Axios.create({
      baseURL: REACT_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
        ? JSON.parse(localStorage.getItem('token'))
        : '';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        //! Nếu token hết hạn tự động logout
        if (error.response.status === 401) {
          localStorage.setItem('user', null);
          localStorage.setItem('brand', null);
          localStorage.setItem('token', null);
        }
        return Promise.reject(error);
      },
    );
    return axios;
  }, []);

  //* Đăng nhập
  const loginUser = (data) =>
    axios.post('/users/login', data).then((res) => res.data);
  //* Lấy toàn bộ khách nhân viên quản lý
  const getAllStaff = (roleId) =>
    axios
      .get(`/users?status=0`, roleId)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy toàn bộ thương hiệu
  const getBrands = () =>
    axios
      .get('/brands?Status=0')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy thương hiệu theo ID
  const getBrandById = (id) =>
    axios
      .get(`/brands/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả level khách hàng
  const getLevelUser = (id) =>
    axios
      .get(`/levels/brand/${id}?status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách hàng
  const getCustomers = () =>
    axios
      .get('/customers')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách theo brand, và name
  const getCustomersStaff = ({ brandId, name }) =>
    axios
      .get(`/customers?BrandId=${brandId}&Username=${name}&Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy khách hàng theo trang;
  const getCustomersByPage = ({ brandId, name, PageIndex }) =>
    axios
      .get(
        `/customers?BrandId=${brandId}&Username=${name}&PageSize=8&PageIndex=${PageIndex}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách theo ID chiến dịch
  const getCustomersByCapaignId = (id) =>
    axios
      .get(`/customers?CampaignId=${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả chiến dịch
  const getcampaigns = (id) =>
    axios
      .get(`/campaign?brandId=${id}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Thêm chiến dịch vào user
  const postCampaignToUser = (data) =>
    axios
      .post(`/campaign/AddCustomer`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tải lên khách hàng
  const postCustomer = ({ data, CampaignId }) =>
    axios
      .post(`/customers?CampaignId=${CampaignId}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy chiến dịch theo ID
  const getCampaignbyID = (id) =>
    axios
      .get(`/campaign/${id}}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy dữ liệu
  const getSource = (id) =>
    axios
      .get(`/source-datas?BrandId=${id}&Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả kênh
  const getChannels = (id) =>
    axios
      .get(`/channels?brandId=${id}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy khách hàng theo ID
  const getCustomer = (id) =>
    axios
      .get(`/customers/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhất khách hàng
  const updateCustomer = ({ id, data }) =>
    axios
      .patch(`/customers/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //*Lấy tất cả khách theo số điện thoại
  const getCustomerByPhone = (phone) =>
    axios
      .get(`/customers?PhoneNumber=${phone}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu lịch sử cuộc gọi
  const saveHistoryCalled = (data) =>
    axios
      .post('/call-histories', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả sản phẩm
  const getAllProducts = (brandId) =>
    axios
      .get(`/products?brandId=${brandId}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu đơn mới
  const saveProducts = (data) =>
    axios
      .post('/orders', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu sản phẩm vào đơn
  const saveProductsToOrder = (data) =>
    axios
      .post('/orders/details', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch sử đặt hàng theo ID khách
  const getOrderById = (id) =>
    axios
      .get(`/orders/customer/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả kho theo brand ID
  const getAllstore = (brandID) =>
    axios
      .get(`/stores?brandId=${brandID}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lưu lịch trình mới
  const postSchedule = (data) =>
    axios
      .post('/schedule', data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch trình theo ID nhân viên
  const getScheduleById = (id) =>
    axios
      .get(`/schedule?userId=${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy lịch sử cuộc gọi theo ID khách và brand
  const getHistoriesById = ({ brand, id }) =>
    axios
      .get(`/call-histories?DataUserId=${id}&BrandId=${brand}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy ra tất cả hóa đơn theo ngày
  const getAllOrderBydate = ({ startDate, endDate, BrandId, UserId }) =>
    axios
      .get(
        `/reports/GetTotalOrder?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}&UserId=${UserId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy ra tất cả lịch sử cuộc gọi bằng date
  const getAllHtrCallByDate = ({ startDate, endDate, BrandId, UserId }) =>
    axios
      .get(
        `/reports/GetTotalCallDetail?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}&UserId=${UserId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy ra tất cả lịch sử cuộc gọi bằng date và campaign ID
  const getAllHtrCallByDateCpId = ({
    startDate,
    endDate,
    BrandId,
    UserId,
    CampaignId,
  }) =>
    axios
      .get(
        `/reports/GetTotalCallDetail?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}&UserId=${UserId}&CampaignId=${CampaignId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả order theo tháng
  const getAllOrderMonth = ({ year, month, BrandId, UserId }) =>
    axios
      .get(
        `/reports/GetTotalOrderByMonth?year=${year}&month=${month}&BrandId=${BrandId}&UserId=${UserId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả cuộc gọi theo tháng
  const getAllCallByMonth = ({ year, month, BrandId, UserId }) =>
    axios
      .get(
        `/reports/GetTotalCallDetailByMonth?year=${year}&month=${month}&BrandId=${BrandId}&UserId=${UserId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả sản phẩm của nhân viên được đặt
  const getAllProductsStaff = (BrandId) =>
    axios
      .get(`/reports/GetProductReport?brandId=${BrandId}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả order theo ID capamign
  const getOrderByCampaigns = ({ campaignId }) =>
    axios
      .get(`/reports/GetOrderByCampaignId?campaignId=${campaignId}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //! Admin API
  //* Lấy tất cả thương hiệu
  const getAllBrand = () =>
    axios
      .get(`/brands?Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả users
  const getAllUser = () =>
    axios
      .get(`/users?Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Update brand
  const updateBrand = ({ id, data }) =>
    axios
      .patch(`/brands/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo Brand
  const createBrand = (data) =>
    axios
      .post(`/brands`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Thêm người dùng
  const addUser = (data) =>
    axios
      .post(`/users`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy công việc
  const getWorks = () =>
    axios
      .get('/users/exceptAdmin?status=0')
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy người dùng theo ID
  const getUserById = (id) =>
    axios
      .get(`/users/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Update người dùng theo ID
  const updateUserById = ({ id, data }) =>
    axios
      .patch(`/users/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy user brand
  const getUserBrand = (id) =>
    axios
      .get(`/user-brand/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Thêm brand vào user
  const postUserBrand = (data) =>
    axios
      .post(`/user-brand`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật user
  const updateUser = ({ id, data }) =>
    axios
      .patch(`/users/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa brand theo id
  const deleteBrandById = (id) =>
    axios
      .delete(`/brands/${id}?Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  const deleteUserByID = (id) =>
    axios
      .delete(`/users/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //! Manager API
  //* Lấy tất order theo date manager
  const getAllOrderManager = ({ startDate, endDate, BrandId }) =>
    axios
      .get(
        `/reports/GetTotalOrder?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy ra tất cả lịch sử cuộc gọi bằng date manager
  const getAllHtrCallManager = ({ startDate, endDate, BrandId }) =>
    axios
      .get(
        `/reports/GetTotalCallDetail?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả order theo tháng manager
  const getAllOrderMonthManager = ({ year, month, BrandId }) =>
    axios
      .get(
        `/reports/GetTotalOrderByMonth?year=${year}&month=${month}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả cuộc gọi theo tháng manager
  const getAllCallByMonthManager = ({ year, month, BrandId }) =>
    axios
      .get(
        `/reports/GetTotalCallDetailByMonth?year=${year}&month=${month}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả khách
  const getCustomersManager = (brandId) =>
    axios
      .get(`/customers?BrandId=${brandId}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa khách hàng bằng id
  const deleteCustomerByID = (id) =>
    axios
      .delete(`/customers/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Getstaff by date
  const getStaffByDate = ({ startDate, endDate, BrandId }) =>
    axios
      .get(
        `reports/GetStaffByDate?startDate=${startDate}&endDate=${endDate}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Getstaff by month
  const getStaffByMonth = ({ year, month, BrandId }) =>
    axios
      .get(
        `reports/GetStaffByMonth?year=${year}&month=${month}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả cuộc gọi theo tháng
  const getAllCallByMonthMng = ({ year, month, BrandId }) =>
    axios
      .get(
        `/reports/GetTotalCallDetailByMonth?year=${year}&month=${month}&BrandId=${BrandId}`,
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy levels theo id
  const getLevelById = (id) =>
    axios
      .get(`/levels/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Sửa levels theo id
  const editLevelById = ({ id, data }) =>
    axios
      .patch(`/levels/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa levels theo id
  const deleteLevelById = ({ id, data }) =>
    axios
      .delete(`/levels/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Thêm levels
  const postLevel = (data) =>
    axios
      .post(`/levels`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy chi nhánh
  const getStores = (brand) =>
    axios
      .get(`/stores?brandId=${brand}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật chi nhánh
  const updateStores = ({ id, data }) =>
    axios
      .patch(`/stores/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy chi nhánh theo id
  const getStoresById = (id) =>
    axios
      .get(`/stores/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa chi nhánh theo id
  const deleteStoresById = ({ id, data }) =>
    axios
      .patch(`/stores/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo chi nhánh
  const postStores = (data) =>
    axios
      .post(`/stores`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy nguồn data
  const getSources = (brand) =>
    axios
      .get(`/source-datas?BrandId=${brand}&Status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy danh mục
  const getProductCategories = (brand) =>
    axios
      .get(`/product-categories?status=0&brandId=${brand}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả sản phẩm mng
  const getAllProductsMng = (brand) =>
    axios
      .get(`/products?brandId=${brand}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy tất cả chiến dịch
  const getAllCampaignMng = (brand) =>
    axios
      .get(`/campaign?brandId=${brand}&status=0`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Sửa brand theo id
  const editBrandById = ({ id, data }) =>
    axios
      .patch(`/brands/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy source theo id
  const getSourceById = (id) =>
    axios
      .get(`/source-datas/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật source theo id
  const editSource = ({ id, data }) =>
    axios
      .patch(`/source-datas/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa source theo id
  const deleteSource = (id) =>
    axios
      .delete(`/source-datas/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo source
  const createSource = (data) =>
    axios
      .post(`/source-datas`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy channel theo id
  const getChannelById = (id) =>
    axios
      .get(`/channels/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật channel theo id
  const editChannel = ({ id, data }) =>
    axios
      .patch(`/channels/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa channel theo id
  const deleteChannel = (id) =>
    axios
      .delete(`/channels/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo Channel
  const createChannel = (data) =>
    axios
      .post(`/channels`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

  //* Lấy danh mục theo id
  const getCategoryById = (id) =>
    axios
      .get(`/product-categories/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật danh mục theo id
  const editCategory = ({ id, data }) =>
    axios
      .patch(`/product-categories/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa danh mục theo id
  const deleteCategoryById = ({ id, data }) =>
    axios
      .patch(`/product-categories/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo danh mục
  const createCategory = (data) =>
    axios
      .post(`/product-categories`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy sản phẩm theo id
  const getProductById = (id) =>
    axios
      .get(`/products/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật sản phẩm theo id
  const editProduct = ({ id, data }) =>
    axios
      .patch(`/products/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa sản phẩm theo id
  const deleteProductById = ({ id, data }) =>
    axios
      .patch(`/products/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo sản phẩm
  const createProduct = (data) =>
    axios
      .post(`/products`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Lấy chiến dịch theo id
  const getCampaignById = (id) =>
    axios
      .get(`/campaign/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Cập nhật chiến dịch theo id
  const editCampaign = ({ id, data }) =>
    axios
      .patch(`/campaign/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Xóa chiến dịch theo id
  const deleteCampaignById = ({ id, data }) =>
    axios
      .patch(`/campaign/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  //* Tạo chiến dịch
  const createCampaign = (data) =>
    axios
      .post(`/campaign`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  return (
    <AxiosContext.Provider
      value={{
        createCampaign,
        deleteCampaignById,
        editCampaign,
        getCampaignById,
        getProductById,
        editProduct,
        deleteProductById,
        createProduct,
        createCategory,
        deleteCategoryById,
        editCategory,
        getCategoryById,
        createChannel,
        deleteChannel,
        getChannelById,
        editChannel,
        createSource,
        deleteSource,
        editSource,
        getSourceById,
        postStores,
        deleteStoresById,
        updateStores,
        getStoresById,
        editBrandById,
        getAllCampaignMng,
        getAllProductsMng,
        getProductCategories,
        getSources,
        getStores,
        postLevel,
        deleteLevelById,
        editLevelById,
        getLevelById,
        getAllCallByMonthMng,
        getStaffByMonth,
        getStaffByDate,
        deleteCustomerByID,
        deleteUserByID,
        getCustomersByPage,
        getCustomersManager,
        getAllHtrCallByDateCpId,
        deleteBrandById,
        getAllCallByMonthManager,
        getAllOrderMonthManager,
        getAllHtrCallManager,
        getAllOrderManager,
        updateUser,
        postUserBrand,
        getUserBrand,
        getOrderByCampaigns,
        updateUserById,
        getUserById,
        getWorks,
        addUser,
        createBrand,
        updateBrand,
        getAllUser,
        getAllBrand,
        getAllProductsStaff,
        getAllCallByMonth,
        getAllOrderMonth,
        getAllHtrCallByDate,
        getAllOrderBydate,
        postCampaignToUser,
        getHistoriesById,
        getOrderById,
        saveProductsToOrder,
        getCampaignbyID,
        getScheduleById,
        getCustomersByCapaignId,
        getCustomersStaff,
        postSchedule,
        getAllstore,
        saveProducts,
        getAllProducts,
        saveHistoryCalled,
        getCustomerByPhone,
        updateCustomer,
        getCustomer,
        loginUser,
        getAllStaff,
        getBrands,
        getBrandById,
        getLevelUser,
        getCustomers,
        getcampaigns,
        postCustomer,
        getSource,
        getChannels,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios() {
  return useContext(AxiosContext);
}
