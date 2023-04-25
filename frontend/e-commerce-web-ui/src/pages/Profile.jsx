import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Profile.css'

const Profile = (props) => {
    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')

    if (!token || !user) {
        props.history.push('/login')
    }

    let history = useNavigate()

    let [formPassword, setFormPassword] = useState('')
    let [formEmail, setFormEmail] = useState(user.email)
    let [formName, setFormName] = useState(user.name)
    let [formConfirmPassword, setFormConfirmPassword] = useState('')

    const handleFormPasswordChange = (e) => {
        setFormPassword(e.target.value)
    }

    const handleFormEmailChange = (e) => {
        setFormEmail(e.target.value)
    }

    const handleFormNameChange = (e) => {
        setFormName(e.target.value)
    }

    const handleFormConfirmPasswordChange = (e) => {
        setFormConfirmPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Profile')

        if (formPassword !== formConfirmPassword) {
            alert('Passwords do not match')
            return
        }

        let props = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                password: formPassword,
                email: formEmail,
                name: formName
            })
        }
        let response = fetch(`http://localhost:5041/user/${user._id}`, props)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                if (data._id) {
                    localStorage.setItem('user', JSON.stringify(data))
                    alert('Profile updated')
                } else {
                    alert('Profile update failed')
                }
            })
    }

    return (<div className='profile-grid'>
        <Bubble
            className='center-bubble-contents'
            style={{
                width: '250px',
                gridColumn: '1',
                gridRow: '1',
            }}>
            <h1>Profile</h1>
        </Bubble>
        <Bubble
            className='center-bubble-contents'
            style={{
                width: '200px',
                gridColumn: '2',
                gridRow: '3',
            }}>
            <p>Password Reset: </p>
            <input type="password" value={formPassword} onChange={handleFormPasswordChange} />
            <p>Confirm Password: </p>
            <input type="text" value={formConfirmPassword} onChange={handleFormConfirmPasswordChange} />
        </Bubble>
        <Bubble
            className='center-bubble-contents'
            style={{
                width: '200px',
                gridColumn: '4',
                gridRow: '3',
            }}>
            <p>Email: </p>
            <input type="text" value={formEmail} onChange={handleFormEmailChange} />
        </Bubble>
        <Bubble
            className='center-bubble-contents'
            style={{
                width: '175px',
                gridColumn: '3',
                gridRow: '1',
            }}>
            <p>Name: </p>
            <input type="text" value={formName} onChange={handleFormNameChange} />
        </Bubble>
        <Bubble
            className='center-bubble-contents profile-change-submit'
            onClick={handleSubmit}
            style={{
                width: '100px',
                gridColumn: '3',
                gridRow: '3',
                marginLeft: '50px',
                backgroundColor: '#077f19'
            }}>
            <p style={{ margin: "0" }}>Submit</p>
        </Bubble>
        <Bubble
            className='center-bubble-contents orders-link'
            onClick={() => { history('/profile/orders') }}
            style={{
                width: '100px',
                gridColumn: '4',
                gridRow: '1',
                marginLeft: '50px',
                backgroundColor: '#0303a9',
                color: 'white',
                cursor: 'pointer',
                userSelect: 'none'
            }}
        >
            <p style={{ margin: "0" }}>Orders</p>
        </Bubble>
    </div>)
}

const Bubble = ({ children, style, className, onClick }) => {
    return (<>
        <div className={className + " bubble-background"} style={style} onClick={onClick}>
            {children}
        </div>
    </>)
}

export default Profile