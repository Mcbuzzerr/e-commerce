import { Link } from 'react-router-dom' //Will probably want
import './css/Login.css'

const Register = (props) => {
    return (<div className='login-body'>
        <div className='login-card'>
            <h1>Register</h1>
            <form>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" />
                <label for="name">Name</label>
                <input type="text" id="name" name="name" />
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
                <input type="submit" value="Register" />
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>)
}

export default Register