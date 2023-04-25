import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalWrapper from './components/globalWrapper';
import ProductGrid from './components/productGrid';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
const App = (props) => {
  let loggy = false;
  if (localStorage.getItem('user')) {
    loggy = true;
  }
  const [loggedIn, setLoggedIn] = React.useState(loggy);


  const handleLogin = (e) => {
    console.log("EEK")
    setLoggedIn(true);
    window.location.href = "/";
  }

  const handleLogout = () => {
    console.log("EEK")
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <React.StrictMode>
      <BrowserRouter>
        <GlobalWrapper handleLogout={handleLogout} loggedIn={loggedIn}>
          <Routes>
            <Route exact path="/" Component={() => <Home />} />
            <Route exact path="/products" Component={() => <ProductGrid columns={4} rows={3} filter={true} pagination={true} />} />
            <Route exact path="/cart" Component={() => <Cart />} />
            <Route exact path="/profile" Component={() => <Profile />} />
            <Route exact path="/profile/orders" Component={() => <Orders />} />
            <Route exact path="/login" Component={() => <Login handleLogin={handleLogin} />} />
            <Route exact path="/register" Component={Register} />
            <Route exact path="/admin" Component={() => <div>Admin</div>} />
            <Route path="*" Component={() => <div>404</div>} />
          </Routes>
        </GlobalWrapper>
      </BrowserRouter>
    </React.StrictMode>
  )
}

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
