import ProductGrid from '../components/productGrid';
import './css/Home.css';

const Home = (props) => {
  return (<>
    <div className='product-banner-container'>
      <div className='product-banner'></div>
      <h1 className='product-banner-text'><span className='lobster-font'>Happiness</span> begins with the gift of <span className='lobster-font'>H</span></h1>
      <div className='down-arrow-container'></div>
    </div>
    <div>
      <h1>Featured Products</h1>
      <ProductGrid rows={1} columns={5} />
      <div className='center-text'>
        <a href='/products'><h1>View all products</h1></a>
      </div>
    </div>
  </>);
}

export default Home;


//DONE: Homepage
//DONE: Login page
//DONE: Register page
//DONE: Global wrapper component (The bits that are on every page)
//DONE: Product grid component

//TODO: Add authentication to all pages
//TODO: Add API calls to almost all pages
//TODO: Add admin, and profile related pages

//Pages:
//Home
//Products - TODO: Add API call to get products (This goes on the product grid component)
//Login - TODO: Add API call to authenticate user
//Register - TODO: Add API call to register user
//Cart - TODO: All of it
//Orders - TODO: All of it
//Profile - TODO: All of it
//Admin - TODO: All of it