import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalWrapper from './components/globalWrapper';
import ProductGrid from './components/productGrid';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalWrapper>
        <Routes>
          <Route exact path="/" Component={() => <Home />} />
          <Route exact path="/products" Component={() => <ProductGrid columns={4} rows={3} filter={true} pagination={true} />} />
          <Route exact path="/cart" Component={() => <div>Cart</div>} />
          <Route exact path="/profile" Component={() => <div>Profile</div>} />
          <Route exact path="/profile/orders" Component={() => <div>Orders</div>} />
          <Route exact path="/login" Component={Login} />
          <Route exact path="/register" Component={Register} />
          <Route exact path="/admin" Component={() => <div>Admin</div>} />
        </Routes>
      </GlobalWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
