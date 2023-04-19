import { Link } from 'react-router-dom' //Will probably want
import './css/Login.css'

const Login = (props) => {
    return (<div className='login-body'>
        <div className='login-card'>
            <h1>Login</h1>
            <form>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" />
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
                <input type="submit" value="Login" />
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>)
}

export default Login