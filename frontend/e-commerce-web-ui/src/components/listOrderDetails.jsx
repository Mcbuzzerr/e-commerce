import { useState } from 'react'
import './css/listOrderDetails.css'

const ListOrderDetails = ({ order, isPastTense }) => {
    const order_id = order._id
    const [items, setItems] = useState(order.items)
    const [couponCode, setCouponCode] = useState(order.couponCode)
    const [shippingAddress, setShippingAddress] = useState(order.shippingAddress)
    const [total, setTotal] = useState(order.total)

    const handleCouponCodeChange = (e) => {
        setCouponCode(e.target.value)
    }

    const handleStreetChange = (e) => {
        setShippingAddress({ ...shippingAddress, street: e.target.value })
    }

    const handleStreet2Change = (e) => {
        setShippingAddress({ ...shippingAddress, street2: e.target.value })
    }

    const handleCityChange = (e) => {
        setShippingAddress({ ...shippingAddress, city: e.target.value })
    }

    const handleStateChange = (e) => {
        setShippingAddress({ ...shippingAddress, state: e.target.value })
    }

    const handleZipChange = (e) => {
        setShippingAddress({ ...shippingAddress, zip: e.target.value })
    }

    const handleCountryChange = (e) => {
        setShippingAddress({ ...shippingAddress, country: e.target.value })
    }

    const handleSubmitChanges = () => {
        let body = {
            "items": items,
            "couponCode": couponCode,
            "shippingAddress": shippingAddress
        }
        let props = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
        fetch(`http://localhost:5041/cart/${order_id}`, props)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setShippingAddress(data.shippingAddress)
                setCouponCode(data.couponCode)
                setTotal(data.total)
            })
    }

    const handleRemoveItem = (iterator) => {
        let newItems = [...items]
        newItems.splice(iterator, 1)
        setItems(newItems)
        fetch(`http://localhost:5041/cart/${order_id}/item/remove/${iterator}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    const handleCheckout = () => {
        console.log('checkout')
        console.log(order_id)
        console.log(items)
        console.log(shippingAddress)
        console.log(couponCode)
        console.log(total)
        fetch(`http://localhost:5041/cart/${order_id}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            let user = localStorage.getItem('user')
            user = JSON.parse(user)
            user.cartID = null
            user.orderHistory = data.orderHistory
            localStorage.setItem('user', JSON.stringify(user))
            window.location.href = '/profile/orders'
        })
    }

    return (<div className='list-body'>
        <div className='list-header'>
            <div className='list-header-sandwhich'>
                <h3>Order Details</h3>
                <p>Coupon Code:<br /><input type='text' className='list-coupon-input' placeholder='None' onChange={handleCouponCodeChange} value={couponCode} disabled={isPastTense}></input></p>
                {isPastTense ? null : <div className='list-apply-change-button' onClick={handleSubmitChanges}>Apply Changes</div>}
            </div>
            <div className='list-address-container'>
                <h3>Shipping Address</h3>
                <input type="text" value={shippingAddress.street} onChange={handleStreetChange} disabled={isPastTense} />
                <input type="text" value={shippingAddress.street2} onChange={handleStreet2Change} disabled={isPastTense} />
                <input type="text" value={shippingAddress.city} onChange={handleCityChange} disabled={isPastTense} />
                <input type="text" value={shippingAddress.state} onChange={handleStateChange} disabled={isPastTense} />
                <input type="text" value={shippingAddress.zip} onChange={handleZipChange} disabled={isPastTense} />
                <input type="text" value={shippingAddress.country} onChange={handleCountryChange} disabled={isPastTense} />
            </div>
        </div>
        <div className='list-footer'>
            <h3>Total: ${total}</h3>
            {isPastTense ? <h3>Status: Pending...</h3> : <h3 className='list-checkout-button' onClick={handleCheckout}>Checkout</h3>}
        </div>
        <div className='list-items'> {/* list-items should siplay flex-wrap, list-item's are circles with info */}
            {items.map((item, iterator) => {
                return (<div className='list-item'>
                    <b>{item.title}</b>
                    <div>{item.description}</div>
                    <div>${item.price}</div>
                    {isPastTense ? <div className='list-item-remove-button' onClick={() => { alert("Refund Denied") }}>Apply for Refund</div> : <div className='list-item-remove-button' onClick={() => handleRemoveItem(iterator)}>Remove from Cart</div>}
                </div>)
            })}
        </div>
    </div>)
}

export default ListOrderDetails