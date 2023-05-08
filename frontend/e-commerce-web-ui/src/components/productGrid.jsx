import { useEffect, useState } from 'react' //Possibly unnecessary
import { Link } from 'react-router-dom' //Will probably want
import './css/productGrid.css'

const ProductGrid = (props) => {
    let [rawProducts, setRawProducts] = useState(props.products)
    let [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    let user = JSON.parse(localStorage.getItem('user'))

    let columns = props.columns
    if (!columns) columns = 4

    let rows = props.rows
    if (!rows) rows = 3
    useEffect(() => {
        if (!rawProducts) {
            rawProducts = fetch("http://localhost:5041/catalog/get_all", { method: 'GET' })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    console.log(data)
                    setRawProducts(data)
                    setPageCount(Math.ceil(data.length / (rows * columns)))
                })
        }
    }, [])

    if (rawProducts) {
        if (rows > rawProducts.length / columns) rows = Math.ceil(rawProducts.length / columns)
    }

    let productsPerPage = rows * columns
    let pagination = props.pagination
    let products = []
    if (rawProducts) {
        for (let i = 0; i < rawProducts.length; i++) {
            if (i % productsPerPage == 0) {
                products.push(rawProducts.slice(i, i + productsPerPage))
            }
        }
    }
    if (!pagination) pagination = false

    let filter = false //props.filter
    if (!filter) filter = false


    const handlePageChange = (changeAmount) => {
        if (currentPage + changeAmount > pageCount - 1) {
            // setCurrentPage(0) //un-comment to make the component loop through pages
        } else if (currentPage + changeAmount < 0) {
            // setCurrentPage(pageCount - 1) //un-comment to make the component loop through pages
        } else {
            setCurrentPage(currentPage + changeAmount)
        }
    }

    const handleAddToCart = (product) => {
        console.log('Adding product to cart: ', product)
        fetch(`http://localhost:5041/cart/${user.cartID}/item/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then((response) => {
                return response.json()
            }).then((data) => {
                console.log(data)
            })
    }

    if (!rawProducts) {
        return <h1>Loading...</h1>
    } else {
        return (<div className='productgrid-body'>
            {/* 
            props taken in:
                - rows
                - columns
                - products (optional, if not provided then grab from database)
            Display a grid of products
            Allow for filtering by price
            Pagination
        */}
            {filter && (
                <div className='product-filter'>
                    <p>Filter by price</p>
                    <input type='number' placeholder='Max price'></input>
                </div>
            )}
            <div className='product-grid' style={{ "--columns": columns, "--rows": rows }}>
                {
                    products[currentPage].map((product) => {
                        return (
                            <div className='product-grid-item'>
                                <b>{product.title}</b>
                                <p>{product.description}</p>
                                <p>${parseFloat(product.price).toPrecision(4)}</p>
                                <div className='product-button' onClick={() => { handleAddToCart(product) }}>
                                    <span className='product-button-text'>Add to cart</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {pagination && (
                <div className='product-arrows'>
                    <div className='product-arrow-container' onClick={() => handlePageChange(-1)}>

                        <i className="fi fi-rr-caret-left product-arrow"></i>

                    </div>


                    <div className='page-indicator'>
                        <p>Page {currentPage + 1} of {pageCount}</p>
                    </div>

                    <div className='product-arrow-container' onClick={() => handlePageChange(1)}>
                        <i className="fi fi-rr-caret-right product-arrow"></i>

                    </div>
                </div>
            )}
        </div>)
    }
}

export default ProductGrid