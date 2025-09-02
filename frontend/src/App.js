import { CartProvider } from './Contexts/CartContext'; 
import { ProductProvider } from './Contexts/ListingContext'; 


import './App.css';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Splash from './Pages/Splash';
import LoginSignup from './Pages/LoginSignup';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyCode from './Pages/VerifyCode';
import CreateNewPassword from './Pages/CreateNewPassword';
import Onboard from './Pages/Onboard';
import Mode from './Pages/Mode';
import HomePage from './Pages/HomePage';
import Details from './Pages/Details';
import Cart from './Pages/Cart';
import CartItem from './Pages/CartItem';
import ToCheckout from './Pages/ToCheckout';
import Checkout from './Pages/Checkout';
import CartEmpty from './Pages/CartEmpty';
import EscrowInfo from './Pages/EscrowInfo';
import PaymentOpt from './Pages/PaymentOpt';
import Payment from './Pages/Payment';
import OrderPay from './Pages/OrderPay';
import MyOrders from './Pages/MyOrders';
import OrderPending from './Pages/OrderPending';
import OrderDelivered from './Pages/OrderDelivered';
import ChatSeller from './Pages/ChatSeller';
import TrackPackage from './Pages/TrackPackage';
import RateProduct from './Pages/RateProduct';
import SearchPage from './Pages/SearchPage';
import NotificationPage from './Pages/NotificationPage';
import Settings from './Pages/Settings';
import ChangePassword from './Pages/ChangePassword';
import ManageAddress from './Pages/ManageAddress';
import AddAddress from './Pages/AddAddress';
import AccountSettings from './Pages/AccountSettings';
import EditProfile from './Pages/EditProfile';
import Support from './Pages/Support';
import SellerDashboard from './Pages/SellerDashboard';
import ChatBuyer from './Pages/ChatBuyer';
import SellerSettings from './Pages/SellerSettings';
import ListingForm from './Pages/ListingForm';
import ItemList from './Pages/ItemList';
import ManageListings from './Pages/ManageListings';
import BuyerMessages from './Pages/BuyerMessages';
import SellerMessages from './Pages/SellerMessages';
import SalesOverview from './Pages/SalesOverview';
import SellerPasswordChange from './Pages/SellerPasswordChange';
import EditProfileSeller from './Pages/EditProfileSeller';
import SellerNotificationPage from './Pages/SellerNotificationPage';
import AdminDashboard from './Pages/AdminDashboard';
import SellerOrders from './Pages/SellerOrders';
import AdminLogin from './Pages/AdminLogin';




function App() {
  return (
    <div>
    <CartProvider>
      <ProductProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/verifycode' element={<VerifyCode/>}/>
        <Route path='/password-reset' element={<CreateNewPassword/>}/>
        <Route path='/page-loading' element={<Onboard/>}/>
        <Route path='/modeselect' element={<Mode/>}/>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin-login' element={<AdminLogin/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path="/product_details/:id" element={<Details />} />
        <Route path='/cart_items' element={<Cart/>}/>
        <Route path='/cart_item' element={<CartItem/>}/>
        <Route path='/empty_cart' element={<CartEmpty/>}/>
        <Route path='/pre_checkout' element={<ToCheckout/>}/>
        <Route path='/checkout' element={<Checkout/>}/> 
        <Route path='/escrowinfo' element={<EscrowInfo/>}/> 
        <Route path='/payment_option' element={<PaymentOpt/>}/> 
        <Route path='/make_payment' element={<Payment/>}/> 
        <Route path='/payment_order' element={<OrderPay/>}/> 
        <Route path='/orders_product' element={<MyOrders/>}/> 
        <Route path='/pending_order' element={<OrderPending/>}/> 
        <Route path='/order_delivered' element={<OrderDelivered/>}/> 
        <Route path="/chat_seller/:conversationId" element={<ChatSeller />} />
        <Route path='/tracking_package' element={<TrackPackage/>}/> 
        <Route path='/product_rating' element={<RateProduct/>}/> 
        <Route path='/search_views' element={<SearchPage/>}/> 
        <Route path='/notifications' element={<NotificationPage/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/password_changing' element={<ChangePassword/>}/>
        <Route path='/address_management' element={<ManageAddress/>}/>
        <Route path="/address_adding" element={<AddAddress />} />
       <Route path="/address_edit/:id" element={<AddAddress />} />
        <Route path='/account_settings' element={<AccountSettings/>}/>
        <Route path='/edit_profile' element={<EditProfile/>}/> 
        <Route path='/buyer_support' element={<Support/>}/> 
        <Route path='/sellers_chat' element={<SellerMessages/>}/> 

        


        <Route path='/seller_dashboard' element={<SellerDashboard/>}/> 
        <Route path="/seller_orders" element={<SellerOrders />} />
        <Route path='/chat_buyer/:conversationId' element={<ChatBuyer />} />
        <Route path='/seller_profile_settings' element={<SellerSettings/>}/> 
        <Route path='/add_items' element={<ListingForm/>}/> 
        <Route path='/edit_item/:id' element={<ListingForm />} />
        <Route path='/items_list' element={<ItemList/>}/> 
        <Route path='/manage_items_list' element={<ManageListings/>}/> 
        <Route path='/buyers_chat' element={<BuyerMessages/>}/> 
        <Route path='/sales_overview' element={<SalesOverview/>}/> 
        <Route path='/seller_password_changing' element={<SellerPasswordChange/>}/> 
        <Route path='/edit_seller_profile' element={<EditProfileSeller/>}/> 
        <Route path='/seller_notifications' element={<SellerNotificationPage/>}/> 

        


       {/* <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/shop" element={<Shop />} />
                <Route
                  path="/mens"
                  element={<ShopCategory banner={men_banner} category="men" />}
                />
                <Route
                  path="/womens"
                  element={<ShopCategory banner={women_banner} category="women" />}
                />
                <Route
                  path="/kids"
                  element={<ShopCategory banner={kid_banner} category="kid" />}
                />
                <Route path="/product" element={<Product />}>
                  <Route path=":productId" element={<Product />} />
                </Route>
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<LoginSignup />} />
              </Routes>
              <Footer />
            </>
          }
        />*/}
      </Routes>
      </BrowserRouter>
        </ProductProvider>
      </CartProvider>
    </div>
  );
}

export default App;
