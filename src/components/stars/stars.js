import React from 'react';
import './stars.scss';

const Stars = ({ rank }) => {
    /* ----- Render ------ */
    const render_stars = () => {
        let i = 0;
        let stars = [];
        for(; i < Math.floor(rank) && i < 5; i++) {
            stars.push(
                <img key={i} alt='' src='./images/star-full.png' />
            ) 
        }
        if (rank % 1 !== 0 && i < 5) {
            // case rank is float
            stars.push(
                <img key={i} alt='' src='./images/star-half.png' />
            ) 
            i++;
        }
        for(; i < 5; i++) {
            stars.push(
                <img key={i} alt='' src='./images/star-empty.png' />
            ) 
        }
        return(stars);
    }

    return(
        <div className='stars'>
            <div className='stars-rank'>
                {render_stars()}
            </div>
            <div className='stars-pop'>

            </div>
        </div>
    )
}
export default Stars;