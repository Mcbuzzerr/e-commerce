import React from 'react' //Possibly unnecessary
import { Link } from 'react-router-dom' //Will probably want
import './css/productGrid.css'

const ProductGrid = (props) => {
    let rawProducts = props.products
    if (!rawProducts) {
        rawProducts = [
            {
                id: 1,
                title: 'Product 1',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 2,
                title: 'Product 2',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 3,
                title: 'Product 3',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 4,
                title: 'Product 4',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 5,
                title: 'Product 5',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 6,
                title: 'Product 6',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 7,
                title: 'Product 1',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 8,
                title: 'Product 2',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 9,
                title: 'Product 3',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 10,
                title: 'Product 4',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 11,
                title: 'Product 5',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 12,
                title: 'Product 6',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 12,
                title: 'Product 6',
                description: 'This is a product',
                price: 10.00
            },
            {
                id: 13,
                title: 'Product 7',
                description: 'This is a product',
                price: 10.00
            },
        ]
    }

    let columns = props.columns
    if (!columns) columns = 4

    let rows = props.rows
    if (!rows) rows = 3
    if (rows > rawProducts.length / columns) rows = Math.ceil(rawProducts.length / columns)

    let productsPerPage = rows * columns
    let pagination = props.pagination
    let products = []
    for (let i = 0; i < rawProducts.length; i++) {
        if (i % productsPerPage == 0) {
            products.push(rawProducts.slice(i, i + productsPerPage))
        }
    }
    if (!pagination) pagination = false
    let [pageCount, setPageCount] = React.useState(products.length)
    const [currentPage, setCurrentPage] = React.useState(0)

    let filter = props.filter
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
            {console.log(currentPage)}
            {
                products[currentPage].map((product) => {
                    return (
                        <div className='product-grid-item'>
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p>${parseFloat(product.price).toPrecision(4)}</p>
                            <div className='product-button'>
                                <span className='product-button-text'>Add to cart</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        {pagination && (
            <div className='product-arrows'>
                <div className='product-arrow left' onClick={() => handlePageChange(-1)}>
                </div>

                <div className='page-indicator'>
                    <p>Page {currentPage + 1} of {pageCount}</p>
                </div>

                <div className='product-arrow right' onClick={() => handlePageChange(1)}>
                </div>
            </div>
        )}
    </div>)
}

export default ProductGrid