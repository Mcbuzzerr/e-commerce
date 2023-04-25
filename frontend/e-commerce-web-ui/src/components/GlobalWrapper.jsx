import React from 'react'
import { Link } from 'react-router-dom'
import './css/globalWrapper.css'
import jwt_decode from 'jwt-decode'


const GlobalWrapper = ({ loggedIn, handleLogout, children }) => {

    // UNFINISHED, FOLLOW THE PLAN LAID OUT IN CHATGPT
    // Refactor index.js to be a functional component called app
    // Give app a state variable called user
    // Upon login or logout, update the user state variable
    // If user is null, display the login and register links
    // If user is not null, display the cart, profile, and logout links

    React.useEffect(() => {
        console.log('GlobalWrapper mounted')
        if (localStorage.getItem('token')) {
            const decoded = jwt_decode(localStorage.getItem('token'))
            if (Date.now() >= decoded.exp * 1000) {
                console.log('token expired')
                handleLogout()
            } else {
                console.log('token not expired')
            }
        } else {
            console.log('no token')
        }
    }, [])

    return (<>
        <nav className='navbar'>
            <Link to="/"><h1>H</h1></Link>
            <ul className='centered-menu-item'>
                <li className='nav-item'><Link to="/products">Products</Link></li>
            </ul>
            <ul className='top-menu'>

                {loggedIn ? (
                    <>
                        <li className='nav-item'><Link to="/cart">Cart</Link></li>
                        <li className='nav-item'><Link to="/profile">Profile</Link></li>
                        <li className='nav-item'><Link onClick={handleLogout}>Logout</Link></li>
                    </>
                ) : (<>
                    <li className='nav-item'><Link to="/login">Login</Link></li>
                    <li className='nav-item'><Link to="/register">Register</Link></li>
                </>)}
                {/* Only display the following when the user is an admin */}
                {/* <li className='nav-item'><Link to="/admin">Admin</Link></li> */}
            </ul>
        </nav>
        <div className='main-body'>
            {children}
        </div>
        <footer>
            <h1 className='lobster-font'>H</h1>
            <p>© 2023 Alex Bates</p>
            <div>
                <h2>Contact us</h2>
                <p>Phone: 555-555-5555</p>
                <p>Email:
                    <a href="mailto:fake-email@address.com">email@address.com</a>
                </p>
                <a href='https://instagram.com'><i className="fi fi-brands-instagram"></i></a>
                <a href='https://facebook.com'><i className="fi fi-brands-facebook"></i></a>
                <a href='https://twitter.com'><i className="fi fi-brands-twitter"></i></a>
                <a href='https://linkedin.com'><i className="fi fi-brands-linkedin"></i></a>
            </div>
        </footer>
    </>)
}

export default GlobalWrapper