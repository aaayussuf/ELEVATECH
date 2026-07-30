import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/layout/AdminLayout";

import Home from "./pages/Home";
import TestUpload from "./pages/TestUpload";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import About from "./pages/About";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import CustomerDetails from "./pages/admin/CustomerDetails";
import ProductList from "./pages/admin/ProductList";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrderDetails from "./pages/admin/orders/OrderDetails";
import AdminCategories from "./pages/admin/Categories";

import AccountDashboard from "./pages/account/Dashboard";
import AccountProfile from "./pages/account/Profile";
import AccountOrders from "./pages/account/Orders";
import OrderDetails from "./pages/account/OrderDetails";
import Wishlist from "./pages/account/Wishlist";
import Addresses from "./pages/account/Addresses";
import ChangePassword from "./pages/account/ChangePassword";

function ProtectedAccountRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/account" element={<Navigate to="/account/dashboard" replace />} />
        <Route path="/account/dashboard" element={<AccountDashboard />} />
        <Route path="/account/profile" element={<AccountProfile />} />
        <Route path="/account/orders" element={<AccountOrders />} />
        <Route path="/account/orders/:id" element={<OrderDetails />} />
        <Route path="/account/addresses" element={<Addresses />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
      </Routes>
    </ProtectedRoute>
  );
}



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test-upload" element={<TestUpload />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<PaymentSuccess />} />
      <Route path="/checkout/cancel" element={<PaymentCancel />} />
      <Route path="/about" element={<About />} />


      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
      </Route>
      <Route path="/*" element={<ProtectedAccountRoutes />} />
    </Routes>
  );
}

export default App;

