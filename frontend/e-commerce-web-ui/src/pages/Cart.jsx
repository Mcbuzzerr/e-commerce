import { useEffect, useState } from "react"
import ListOrderDetails from "../components/listOrderDetails"
import './css/Cart.css'

const Cart = (props) => {
    let [userCart, setUserCart] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('user')) {
            let user = JSON.parse(localStorage.getItem('user'))
            if (user.cartID) {
                fetch(`http://localhost:5041/cart/${user.cartID}`)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        setUserCart(data)
                    })
            } else {
                let body = {
                    "items": [],
                    "couponCode": "",
                    "shippingAddress": {
                        "street": "123 Example St.",
                        "street2": "APT 117",
                        "city": "Metrocity",
                        "state": "ST",
                        "zip": "12345",
                        "country": "US"
                    }
                }
                let props = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
                fetch(`http://localhost:5041/cart/create`, props)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        let user = JSON.parse(localStorage.getItem('user'))
                        user.cartID = data._id
                        localStorage.setItem('user', JSON.stringify(user))
                        setUserCart(data)
                        return user
                    })
                    .then((user) => {
                        fetch(`http://localhost:5041/user/${user.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(user)
                        })
                    })
            }
        }
    }, [])

    if (!userCart) {
        return (<>
            <h1>Loading...</h1>
        </>)
    }

    return (<div className="cart-container-center-insides">
        <ListOrderDetails order={userCart} />
    </div>)
}

export default Cart