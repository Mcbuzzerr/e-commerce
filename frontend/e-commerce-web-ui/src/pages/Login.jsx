import { useState } from 'react'
import { Link } from 'react-router-dom'
import './css/Login.css'

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Login')
        console.log(email)
        console.log(password)
        let props = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
        let response = fetch('http://localhost:5041/user/authenticate', props)
            .then((response) => {

                return response.json()
            }).then((data) => {
                console.log(data)
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token)
                    localStorage.setItem('user', data.user)
                    handleLogin()
                } else {
                    alert('Invalid credentials')
                }
            })
    }

    return (<div className='login-body'>
        <div className='login-card'>
            <h1>Login</h1>
            <form>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <input type="submit" value="Login" onClick={handleSubmit} />
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>)
}

export default Login