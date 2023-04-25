import { Navigate, Route } from 'react-router-dom'

const SecuredRoute = ({ isLoggedIn, route }) => {
    if (isLoggedIn) {
        console.log("Rahoo")
        return <Route />
    } else {
        console.log("Yippeee")
        return <Navigate to='/login' />
    }
}

export default SecuredRoute