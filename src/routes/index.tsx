import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { DefaultLayout, VerticalLayout, HorizontalLayout, DetachedLayout, FullLayout } from 'layouts';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import { LayoutTypes } from 'appConstants';
import { useRedux } from 'hooks';
import { Role } from 'config/types';

// lazy load all the views

// auth
const Login = React.lazy(() => import('pages/account/Login'));
const Logout = React.lazy(() => import('pages/account/Logout'));
const Register = React.lazy(() => import('pages/account/Register'));
const Confirm = React.lazy(() => import('pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('pages/account/ForgetPassword'));
const LockScreen = React.lazy(() => import('pages/account/LockScreen'));
const ResetPassword = React.lazy(() => import('pages/account/ResetPassword'));
const SignUpConfirm = React.lazy(() => import('pages/account/SignupConfirm'));
const ChangePassword = React.lazy(() => import('pages/account/ChangePassword'));

//const Login2 = React.lazy(() => import('pages/account/Login2'));
//const Logout2 = React.lazy(() => import('pages/account/Logout2'));
//const Register2 = React.lazy(() => import('pages/account/Register2'));
//const Confirm2 = React.lazy(() => import('pages/account/Confirm2'));
//const ForgetPassword2 = React.lazy(() => import('pages/account/ForgetPassword2'));
//const LockScreen2 = React.lazy(() => import('pages/account/LockScreen2'));

// dashboard
//const AnalyticsDashboard = React.lazy(() => import('pages/dashboard/Analytics'));
//const EcommerceDashboard = React.lazy(() => import('pages/dashboard/Ecommerce'));
//const ProjectDashboard = React.lazy(() => import('pages/dashboard/Project'));
//const EWalletDashboard = React.lazy(() => import('pages/dashboard/E-Wallet'));
const SalesReportDashboard = React.lazy(() => import('pages/dashboard/SalesReport'));
const OperationalMetrics = React.lazy(() => import('pages/dashboard/OperationalMetrics'))
const MetricsHistory = React.lazy(() => import('pages/dashboard/OperationalMetrics/MetricsHistory'));

// apps
//const CalendarApp = React.lazy(() => import('pages/apps/Calendar'));
//const ProjectList = React.lazy(() => import('pages/apps/Projects/List'));
//const ProjectDetail = React.lazy(() => import('pages/apps/Projects/Detail/'));
//const ProjectGannt = React.lazy(() => import('pages/apps/Projects/Gantt'));
//const ProjectForm = React.lazy(() => import('pages/apps/Projects/ProjectForm'));

// - chat
//const ChatApp = React.lazy(() => import('pages/apps/Chat/'));

// -crm
//const CRMDashboard = React.lazy(() => import('pages/apps/CRM/Dashboard'));
//const CRMProjects = React.lazy(() => import('pages/apps/CRM/Projects'));
//const CRMManagement = React.lazy(() => import('pages/apps/CRM/Management'));
//const CRMClients = React.lazy(() => import('pages/apps/CRM/Clients'));
//const CRMOrderList = React.lazy(() => import('pages/apps/CRM/OrderList'));

// - ecommece pages
//const EcommerceProducts = React.lazy(() => import('pages/apps/Ecommerce/Products'));
//const ProductDetails = React.lazy(() => import('pages/apps/Ecommerce/ProductDetails'));
//const Orders = React.lazy(() => import('pages/apps/Ecommerce/Orders'));
//const OrderDetails = React.lazy(() => import('pages/apps/Ecommerce/OrderDetails'));
//const Customers = React.lazy(() => import('pages/apps/Ecommerce/Customers'));
//const Cart = React.lazy(() => import('pages/apps/Ecommerce/Cart'));
//const Checkout = React.lazy(() => import('pages/apps/Ecommerce/Checkout/'));
//const Sellers = React.lazy(() => import('pages/apps/Ecommerce/Sellers'));

// - email
//const Inbox = React.lazy(() => import('pages/apps/Email/Inbox'));
//const EmailDetail = React.lazy(() => import('pages/apps/Email/Detail'));

// - social
//const SocialFeed = React.lazy(() => import('pages/apps/SocialFeed/'));

// - tasks
//const TaskList = React.lazy(() => import('pages/apps/Tasks/List/'));
//const TaskDetails = React.lazy(() => import('pages/apps/Tasks/Details'));
//const Kanban = React.lazy(() => import('pages/apps/Tasks/Board/'));
// - file
//const FileManager = React.lazy(() => import('pages/apps/FileManager'));

// pages
//const Profile = React.lazy(() => import('pages/profile'));
//const Profile2 = React.lazy(() => import('pages/profile2'));
const ErrorPageNotFound = React.lazy(() => import('pages/error/PageNotFound'));
//const ErrorPageNotFoundAlt = React.lazy(() => import('pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('pages/error/ServerError'));

// - other
//const Invoice = React.lazy(() => import('pages/other/Invoice'));
//const FAQ = React.lazy(() => import('pages/other/FAQ'));
//const Pricing = React.lazy(() => import('pages/other/Pricing'));
const Maintenance = React.lazy(() => import('pages/other/Maintenance'));
//const Starter = React.lazy(() => import('pages/other/Starter'));
//const PreLoader = React.lazy(() => import('pages/other/PreLoader/'));
//const Timeline = React.lazy(() => import('pages/other/Timeline'));

//const Landing = React.lazy(() => import('pages/landing/'));

// uikit
//const Accordions = React.lazy(() => import('pages/uikit/Accordions'));
//const Alerts = React.lazy(() => import('pages/uikit/Alerts'));
//const Avatars = React.lazy(() => import('pages/uikit/Avatars'));
//const Badges = React.lazy(() => import('pages/uikit/Badges'));
//const Breadcrumbs = React.lazy(() => import('pages/uikit/Breadcrumb'));
//const Buttons = React.lazy(() => import('pages/uikit/Buttons'));
//const Cards = React.lazy(() => import('pages/uikit/Cards'));
//const Carousels = React.lazy(() => import('pages/uikit/Carousel'));
//const Dropdowns = React.lazy(() => import('pages/uikit/Dropdowns'));
//const EmbedVideo = React.lazy(() => import('pages/uikit/EmbedVideo'));
//const Grid = React.lazy(() => import('pages/uikit/Grid'));
//const ListGroups = React.lazy(() => import('pages/uikit/ListGroups'));
//const Modals = React.lazy(() => import('pages/uikit/Modals'));
//const Notifications = React.lazy(() => import('pages/uikit/Notifications'));
//const Offcanvases = React.lazy(() => import('pages/uikit/Offcanvas'));
//const Placeholders = React.lazy(() => import('pages/uikit/Placeholders'));
//const Paginations = React.lazy(() => import('pages/uikit/Paginations'));
//const Popovers = React.lazy(() => import('pages/uikit/Popovers'));
//const Progress = React.lazy(() => import('pages/uikit/Progress'));
//const Ribbons = React.lazy(() => import('pages/uikit/Ribbons'));
//const Spinners = React.lazy(() => import('pages/uikit/Spinners'));
//const Tabs = React.lazy(() => import('pages/uikit/Tabs'));
//const Tooltips = React.lazy(() => import('pages/uikit/Tooltips'));
//const Typography = React.lazy(() => import('pages/uikit/Typography'));
//const DragDrop = React.lazy(() => import('pages/uikit/DragDrop'));
//const RangeSliders = React.lazy(() => import('pages/uikit/RangeSliders'));
//const Ratings = React.lazy(() => import('pages/uikit/Ratings'));

// icons
//const Dripicons = React.lazy(() => import('pages/icons/Dripicons'));
//const MDIIcons = React.lazy(() => import('pages/icons/MDIIcons'));
//const Unicons = React.lazy(() => import('pages/icons/Unicons'));

// forms
//const BasicForms = React.lazy(() => import('pages/forms/Basic'));
//const FormAdvanced = React.lazy(() => import('pages/forms/Advanced'));
//const FormValidation = React.lazy(() => import('pages/forms/Validation'));
//const FormWizard = React.lazy(() => import('pages/forms/Wizard'));
//const FileUpload = React.lazy(() => import('pages/forms/FileUpload'));
//const Editors = React.lazy(() => import('pages/forms/Editors'));

// charts
//const ApexChart = React.lazy(() => import('pages/charts/Apex'));
//const ChartJs = React.lazy(() => import('pages/charts/ChartJs'));

// tables
//const BasicTables = React.lazy(() => import('pages/tables/Basic'));
//const AdvancedTables = React.lazy(() => import('pages/tables/Advanced'));

// widgets
//const Widgets = React.lazy(() => import('pages/uikit/Widgets'));

// maps
//const GoogleMaps = React.lazy(() => import('pages/maps/GoogleMaps'));
//const VectorMaps = React.lazy(() => import('pages/maps/VectorMaps'));

//connectivity
const AppsConnectivity = React.lazy(() => import('pages/connectivity/AppsConnectivity'));

//products
const ProductAvailability = React.lazy(() => import('pages/products/ProductAvailability'));

//home
const HomePage = React.lazy(() => import('pages/home/HomePage'));

//Darwin settings
const Settings = React.lazy(() => import('pages/settings/Settings'));

//Kitchen
const Kitchen = React.lazy(() => import('pages/kitchen/KitchenDashboard'));

//Orders
const Orders = React.lazy(() => import('pages/orders/OrderHistory'));

//Menu Dashboard
const MenuDashboard = React.lazy(() => import('pages/menu/MenuDashboard'));

//CounterSale 
const CounterSale = React.lazy(() => import('components/DarwinComponents/CounterSale/CounterSale'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
    component: React.LazyExoticComponent<() => JSX.Element>;
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { appSelector } = useRedux();


    const { layout } = appSelector((state) => ({
        layout: state.Layout,
    }));

    const getLayout = () => {
        let layoutCls: React.ComponentType = HorizontalLayout;

        switch (layout.layoutType) {
            case LayoutTypes.LAYOUT_VERTICAL:
                layoutCls = VerticalLayout;
                break;
            case LayoutTypes.LAYOUT_DETACHED:
                layoutCls = DetachedLayout;
                break;
            case LayoutTypes.LAYOUT_FULL:
                layoutCls = FullLayout;
                break;
            default:
                layoutCls = HorizontalLayout;
                break;
        }
        return layoutCls;
    };
    let Layout = getLayout();
    
    return useRoutes([
        { path: '*', element: <LoadComponent component={ErrorPageNotFound} />}, /** only match this when no other routes match */
        { path: '/', element: <Root /> },
        {
            // public routes
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: 'account',
                    children: [
                        { path: 'login', element: <LoadComponent component={Login} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                        //{ path: 'login2', element: <LoadComponent component={Login2} /> },
                        //{ path: 'register2', element: <LoadComponent component={Register2} /> },
                        //{ path: 'confirm2', element: <LoadComponent component={Confirm2} /> },
                        //{ path: 'forget-password2', element: <LoadComponent component={ForgetPassword2} /> },
                        //{ path: 'lock-screen2', element: <LoadComponent component={LockScreen2} /> },
                        //{ path: 'logout2', element: <LoadComponent component={Logout2} /> },
                        { path: 'reset-password', element: <LoadComponent component={ResetPassword} /> },
                        { path: 'signup-confirm', element: <LoadComponent component={SignUpConfirm} /> },
                        { path: 'change-password', element: <LoadComponent component={ChangePassword} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                {
                    path: 'maintenance',
                    element: <LoadComponent component={Maintenance} />,
                },
            ],
        },
        // auth protected routes
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER, Role.STAFF ]} version={3} component={Layout} />,
            children: [
                {
                    path: 'home',
                    element: <LoadComponent component={HomePage} />,                   
                },
            ],
        },
        {
            path: '/dashboard',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER ]} version={0} component={Layout} />,
            children: [
                {
                    path: 'sales-report',
                    element: <LoadComponent component={SalesReportDashboard} />,                   
                },
                {
                    path: 'operational-metrics',
                    element: <LoadComponent component={OperationalMetrics} />,                
                },
                {
                    path: 'operational-metrics/history',
                    element: <LoadComponent component={MetricsHistory} />
                }
            ],
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER, Role.STAFF ]} version={3} component={Layout} />,
            children: [
                {
                    path: 'connectivity',
                    element: <LoadComponent component={AppsConnectivity} />,
                }
            ]
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER, Role.STAFF ]} version={3} component={Layout} />,
            children: [
                {
                    path: 'products',
                    element: <LoadComponent component={ProductAvailability} />,
                }
            ]
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER, Role.STAFF ]} version={4} component={Layout} />,
            children: [
                {
                    path: 'settings',
                    element: <LoadComponent component={Settings} />,
                }
            ]
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER, Role.STAFF ]} version={5} component={Layout} onlyDesktop={false} />,
            children: [
                {
                    path: 'kitchen',
                    element: <LoadComponent component={Kitchen} />,
                }
            ]
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER ]} version={6} component={Layout} onlyDesktop={false} />,
            children: [
                {
                    path: 'orders',
                    element: <LoadComponent component={Orders} />,
                }
            ]
        },
        {
            path: '/',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER ]} version={7} component={Layout} onlyDesktop={false} />,
            children: [
                {
                    path: 'menu',
                    element: <LoadComponent component={MenuDashboard} />,
                }
            ]
        },
        {
            path: '/counterSale',
            element: <PrivateRoute roleAccess={[ Role.ADMIN, Role.MANAGER ]} version={7} component={CounterSale} onlyDesktop={false} />,
        },       
    ]);
};

export { AllRoutes };
