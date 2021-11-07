import React from 'react';
import './storeContent.scss';
import Product from './product/product';
import SideFilters from './sidefilters/sidefilters';
import { observer } from "mobx-react-lite";

const StoreContent = ({ state, filters, setFilters }) => {
    /* ----- Navigation ------ */
    const goToPrev = () => {
        if(filters.page === 1) return;
        setFilters(prevFilters => ({
            ...prevFilters,
            page: filters.page - 1,
        }));
    }
    const goToNext = () => {
        if(filters.page === state.numOfPages) return;
        setFilters(prevFilters => ({
            ...prevFilters,
            page: filters.page + 1,
        }));
    }
    const goToPage = (page) => {
        if(page > state.numOfPages || page < 1 ) return;
        setFilters(prevFilters => ({
            ...prevFilters,
            page: page,
        }));
        // slide screen up
        // add location query parameter
    }
    /* ----- UI Function ----- */
    const handleSortChange = (e) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            sort: e.target.value,
        }));
    }
    /* ----- Render ------ */
    const render_products = () => {
        return state.products.map( (product, i) => {
            return(
                <Product key={i} state={state} product={product} />
            )
        });
    }
    const render_pagination = () => {
        let page_btns = []
        let end = filters.page + 1;
        let start = filters.page - 1;
        
        page_btns.push(
            <li key='1' className={filters.page === 1 ? 'pageNum pageNum-disable' :'pageNum'} onClick={()=> goToPage(1)}>
                <span>1</span>
            </li>
        );
        if (start < 2) start = 2;

        if(end > state.numOfPages - 1) end = state.numOfPages - 1;
        if(filters.page === 1 && state.numOfPages > 2) end = 3;
        else if(filters.page > 3) {
            page_btns.push(
                <li key='0' className='pageNum pageNum-disable'>
                    <span>...</span>
                </li>
            );
        }
        for(let i=start; i <= end; i++) {
            page_btns.push(
                <li key={i} className='pageNum' onClick={()=> goToPage(i)}>
                    <span>{i}</span>
                </li>
            ); 
        }
        if(end < state.numOfPages - 1) {
            page_btns.push(
                <li key={end+1} className='pageNum pageNum-disable'>
                    <span>...</span>
                </li>
            );
            page_btns.push(
                <li key={end+2} className='pageNum' onClick={()=> goToPage(state.numOfPages)}>
                    <span>{state.numOfPages}</span>
                </li>
            );
        } else if(state.numOfPages > 1) {
            page_btns.push(
                <li key={end+1} className={filters.page === state.numOfPages ? 'pageNum pageNum-disable' :'pageNum'} onClick={()=> goToPage(state.numOfPages)}>
                    <span>{state.numOfPages}</span>
                </li>
            );
        }
        return(page_btns);
    }
    

    return(
        <div className="store-content">
            <div className='sort-bar'>
                <div className='result-txt'>

                </div>
                <div className='sort-select'>
                    <select value={filters.sort} onChange={handleSortChange}>
                        <option value='0'>Featured</option>
                        <option value='1'>Price: Low to High</option>
                        <option value='2'>Price: High to Low</option>
                        <option value='3'>Avg. Customer Review</option>
                        <option value='4'>New Arrivals</option>
                    </select>
                </div>
            </div>
            <div className='content'>
                <SideFilters state={state} filters={filters} setFilters={setFilters} />
                <div className='store-products'>
                    <div className='products-row'>
                    <span className='content-txt'>Price and other details may vary based on product size and color.</span>
                    </div>
                    {state.products.length ?
                        <div className='products-grid'>
                            {render_products()}
                        </div>
                        :
                        <div className='no-products'><span>No product found.</span></div>
                    }
                    <div className="pagination">
                        <ul>
                            <li key='prev-btn' className={filters.page === 1 ?  'pageNum pageNum-disable' : 'pageNum'} onClick={filters.page !== 1 && state.numOfPages > 1 ? goToPrev : null}><span>Previous</span></li>
                            {render_pagination()}
                            <li key='next-btn' className={state.numOfPages === 1 || filters.page > state.numOfPages - 1 ? 'pageNum pageNum-disable' : 'pageNum'} onClick={state.numOfPages !== 1 || filters.page < state.numOfPages ? goToNext : null}><span>Next</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default observer(StoreContent)