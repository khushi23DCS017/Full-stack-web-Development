import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import Layout from './components/layout/Layout';

// Routing
import PrivateRoute from './components/routing/PrivateRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Product Pages
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import LowStockProducts from './pages/products/LowStockProducts';

// Customer Pages
import CustomerList from './pages/customers/CustomerList';
import CustomerForm from './pages/customers/CustomerForm';

// Sales Pages
import SalesList from './pages/sales/SalesList';
import NewSale from './pages/sales/NewSale';
import SaleDetails from './pages/sales/SaleDetails';

// User Management Pages
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';

// UI Components
import NotificationContainer from './components/ui/NotificationContainer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/products/low-stock" element={<LowStockProducts />} />
              
              {/* Customer Routes */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/edit/:id" element={<CustomerForm />} />
              
              {/* Sales Routes */}
              <Route path="/sales" element={<SalesList />} />
              <Route path="/sales/new" element={<NewSale />} />
              <Route path="/sales/:id" element={<SaleDetails />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<PrivateRoute requireAdmin={true} />}>
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
            </Route>
            
            {/* Redirect root to dashboard if needed */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
          <NotificationContainer />
        </NotificationProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
