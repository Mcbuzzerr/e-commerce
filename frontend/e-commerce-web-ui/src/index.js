import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GlobalWrapper from './components/globalWrapper';
import ProductGrid from './components/productGrid';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalWrapper><Home /></GlobalWrapper>,
  },
  {
    path: '/products',
    element: <GlobalWrapper><ProductGrid columns={4} rows={3} filter={true} pagination={true} /></GlobalWrapper>,
  },
  {
    path: '/cart',
    element: <div>Cart</div>,
  },
  {
    path: '/profile',
    element: <div>Profile</div>,
  },
  {
    path: '/profile/orders',
    element: <div>Orders</div>,
  },
  {
    path: '/login',
    element: <GlobalWrapper><Login /></GlobalWrapper>,
  },
  {
    path: '/register',
    element: <GlobalWrapper><Register /></GlobalWrapper>,
  },
  {
    path: '/admin',
    element: <div>Admin</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
