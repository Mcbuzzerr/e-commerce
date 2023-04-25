import { useState } from 'react'
import { Link } from 'react-router-dom' //Will probably want
import './css/Login.css'

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        let newUser = {
            name: name,
            email: email,
            password: password
        }

        let props = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }

        let response = fetch('http://localhost:5041/user/create', props)
            .then((response) => {
                console.log(response)
                return response.json()
            }).then((data) => {
                console.log(data)
                alert('User created. Please login.')
                window.location.href = '/login'
            })
    }

    return (<div className='login-body'>
        <div className='login-card'>
            <h1>Register</h1>
            <form>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) => { setName(e.target.value) }}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <input type="submit" value="Register" onClick={handleSubmit} />
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>)
}

export default Register