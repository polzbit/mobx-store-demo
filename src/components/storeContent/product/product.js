import React from 'react';
import './product.scss';
import Stars from '../../stars/stars';

const Product = ({ state, product }) => {
    return(
        <div className='product'>
            <div className='img'>
                <img alt='' src={product.img}  />
            </div>
            <div className='product-name'>
                <span>{product.name}</span>
            </div>
            <div className='rating'>
                <Stars rank={product.rank} />
                <span>{product.reviews.length}</span>
            </div>
            <div className='price'>
                <span>{product.price} {state.currency}</span>
            </div>
            <div className='shipping'>
                {product.free_shipping ? 
                    <span><b>FREE Shipping</b> to {state.location}</span>
                :
                    <span>Ships to {state.location}</span>
                }
            </div>
        </div>
    )
}

export default Product