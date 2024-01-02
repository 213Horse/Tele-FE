//! modules
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
//Components
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
const BrandManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/BrandManagement'),
);
const Configuration = lazy(() =>
  import('./pages/Admin/RightAdmin/Configuration'),
);
const UserManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/UserManagement'),
);
const WorkflowManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/WorkflowManagement'),
);
const Brand = lazy(() => import('./pages/Brand'));
const DetailsUser = lazy(() => import('./pages/DetailsUser'));
const Order = lazy(() => import('./pages/DetailsUser/Order'));
const Schedule = lazy(() => import('./pages/DetailsUser/Schedule'));
const StaffManager = lazy(() => import('./pages/Staff/PageStaff/StaffManager'));
const Calendar = lazy(() => import('./pages/Staff/PageStaff/Calendar'));
const CallReport = lazy(() => import('./pages/Staff/PageStaff/CallReport'));
const Campaign = lazy(() => import('./pages/Staff/PageStaff/Campaign'));
const NewsBoard = lazy(() => import('./pages/Staff/PageStaff/NewsBoard'));
const OrderReport = lazy(() => import('./pages/Staff/PageStaff/OrderReport'));
const CampaignReport = lazy(() =>
  import('./pages/Staff/PageStaff/CampaignReport'),
);
// Manager Pages
const BranchManager = lazy(() =>
  import('./pages/Manager/RightManager/BranchManager'),
);
const CallReportManager = lazy(() =>
  import('./pages/Manager/RightManager/CallReport'),
);
const CampaignManager = lazy(() =>
  import('./pages/Manager/RightManager/CampaignManager'),
);
const CampaignReportManager = lazy(() =>
  import('./pages/Manager/RightManager/CampaignReport'),
);
const CatalogManager = lazy(() =>
  import('./pages/Manager/RightManager/CatalogManager'),
);
const ChannelManager = lazy(() =>
  import('./pages/Manager/RightManager/ChannelManager'),
);
const CtmResourceManager = lazy(() =>
  import('./pages/Manager/RightManager/CtmResourceManager'),
);
const CustomerManager = lazy(() =>
  import('./pages/Manager/RightManager/CustomerManager'),
);
const LevelManager = lazy(() =>
  import('./pages/Manager/RightManager/LevelManager'),
);
const NewsBoardManager = lazy(() =>
  import('./pages/Manager/RightManager/NewsBoard'),
);
const ProductManager = lazy(() =>
  import('./pages/Manager/RightManager/ProductManager'),
);
const UserReport = lazy(() =>
  import('./pages/Manager/RightManager/UserReport'),
);
//Layouts
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ManagerLayout } from './layouts/ManagerLayout';
import { AuthProvider } from './context/AuthContext';
import { SipProvider } from './context/SipContext';
import AxiosProvider from './context/AxiosContex';
import LoadingLazy from './components/LoadingLazy';
import { AdminLayout } from './layouts/AdminLayout';
import DetailsStaff from './pages/Manager/RightManager/DetailsStaff';

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        path: '*',
        element: (
          <Navigate
            to='/login'
            replace
          />
        ),
      },
      {
        path: '/brand',
        element: (
          <Suspense fallback={<LoadingLazy />}>
            <Brand />
          </Suspense>
        ),
      },
      {
        element: <RootLayout />,
        children: [
          {
            path: '/staff',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <StaffManager />
              </Suspense>
            ),
          },
          {
            path: '/lich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Calendar />
              </Suspense>
            ),
          },
          {
            path: '/chien-dich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Campaign />
              </Suspense>
            ),
          },
          {
            path: '/new-board',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <NewsBoard />
              </Suspense>
            ),
          },
          {
            path: '/call-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CallReport />
              </Suspense>
            ),
          },
          {
            path: '/order-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <OrderReport />
              </Suspense>
            ),
          },
          {
            path: '/campaign-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CampaignReport />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <DetailsUser />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id/order',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id/schedule',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Schedule />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <BrandManagement />
              </Suspense>
            ),
          },
          {
            path: '/adm-manager-user',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <UserManagement />
              </Suspense>
            ),
          },
          {
            path: '/adm-manager-work',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <WorkflowManagement />
              </Suspense>
            ),
          },
          {
            path: '/adm-manager-config',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Configuration />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <ManagerLayout />,
        children: [
          {
            path: '/details-staff/:id',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <DetailsStaff />
              </Suspense>
            ),
          },
          {
            path: '/manager',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <NewsBoardManager />
              </Suspense>
            ),
          },
          {
            path: '/manager/:id',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <DetailsUser />
              </Suspense>
            ),
          },
          {
            path: '/manager/:id/order',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: '/manager/:id/schedule',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Schedule />
              </Suspense>
            ),
          },
          {
            path: '/mng-bao-cao-cuoc-goi',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CallReportManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-quan-ly-nhan-vien',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <UserReport />
              </Suspense>
            ),
          },
          {
            path: '/mng-bao-cao-chien-dich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CampaignReportManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-khach-hang',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CustomerManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-level',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <LevelManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-chi-nhanh',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <BranchManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-nguon-khach-hang',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CtmResourceManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-kenh-khach-hang',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <ChannelManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-danh-muc',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CatalogManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-san-pham',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <ProductManager />
              </Suspense>
            ),
          },
          {
            path: '/mng-chien-dich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CampaignManager />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
        ],
      },
    ],
  },
]);

// bao quát
function ContextWrapper() {
  return (
    <AxiosProvider>
      <AuthProvider>
        <SipProvider>
          <Toaster
            position='bottom-right'
            reverseOrder={true}
          />
          <Outlet />
        </SipProvider>
      </AuthProvider>
    </AxiosProvider>
  );
}
