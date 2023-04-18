import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Pages: </p>
        <a href="/products">Products</a> {/* Displays all products */}
        <a href="/cart">Cart</a> {/* Displays user cart */}
        <a href="/profile/orders">Orders</a> {/* Displays user order history, part of profile */}
        <a href="/profile">Profile</a> {/* Displays user profile */}
        <a href="/login">Login</a> {/* Displays login page */}
        <a href="/register">Register</a> {/* Displays register page */}
        <a href="/admin">Admin</a> {/* Displays admin page */}

      </header>
    </div>
  );
}

export default App;
