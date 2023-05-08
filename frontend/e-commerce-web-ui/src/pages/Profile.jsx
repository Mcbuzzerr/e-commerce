import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Profile.css'

const Profile = (props) => {
    // Use this bit of code to redirect the user to the login page if they are not logged in
    let user = localStorage.getItem('user')
    user = JSON.parse(user)
    let token = localStorage.getItem('token')

    if (!token || !user) {
        window.location.href = '/login'
    }
    // End of redirect code

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

        if (formPassword !== formConfirmPassword || formPassword === '' || formConfirmPassword === '') {
            alert('Passwords do not match or are empty')
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
        let response = fetch(`http://localhost:5041/user/${user.id}`, props)
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

    const handleDeleteAccount = (e) => {

        let props = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        let response = fetch(`http://localhost:5041/user/${user.id}`, props)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                alert(data.message)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                window.location.href = '/login'
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
            <p>Password: </p>
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
            className='center-bubble-contents button-hover-active'
            onClick={handleSubmit}
            style={{
                width: '100px',
                gridColumn: '3',
                gridRow: '3',
                marginLeft: '50px',
                backgroundColor: '#077f19',
                userSelect: 'none',
            }}>
            <p style={{ margin: "0" }}>Submit</p>
        </Bubble>
        <Bubble
            className='center-bubble-contents button-hover-active'
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
        <Bubble
            className='center-bubble-contents button-hover-active'
            style={{
                width: '100px',
                gridColumn: '1',
                gridRow: '4',
                backgroundColor: '#a90303',
                userSelect: 'none',
            }}
            onClick={handleDeleteAccount}
        >
            <p style={{ margin: "0" }}>Delete</p>
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