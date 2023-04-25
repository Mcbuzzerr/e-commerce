import { useState, useEffect } from 'react'
import ListOrderDetails from '../components/listOrderDetails'
import './css/Orders.css'

const Orders = (props) => {
    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')
    const [orderHistory, setOrderHistory] = useState(user.orderHistory)

    if (!user || !token) {
        window.location.href = '/'
    }

    return (<div className="orders-body">
        <h1>Order History</h1>
        <div className="orders-list">
            {orderHistory ? orderHistory.map((order) => {
                return (<ListOrderDetails order={order} isPastTense={true} />)
            }) : <div className="order">
                <h2>No Orders</h2>
            </div>}
        </div>
    </div>)
}

export default Orders