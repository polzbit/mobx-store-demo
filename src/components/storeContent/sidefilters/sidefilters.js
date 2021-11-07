import { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import Stars from '../../stars/stars';
import './sideFilters.scss';

const SideFilters = ({ state, filters, setFilters }) => {
    const [rows, setRows] = useState({
        categoriesRows: 0,
        brandsRows: 0,
        showAllCategories:false,
        showAllBrands:false,
    });

    useEffect(() => {
        let cat_rows = 10, brand_rows = 7;
        if((state.categories.length < cat_rows) || rows.showAllCategories) {
            cat_rows = state.categories.length;
        } 
        if((state.brands.length < brand_rows) || rows.showAllBrands) {
            brand_rows = state.brands.length;
        }
        setRows(prevState => ({
            ...prevState,
            categoriesRows: cat_rows,
            brandsRows: brand_rows,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state]);

    const calc_total_rows = () => {
        let count = 0;
        state.categories.forEach(category => {
            count += category.sub_categories.length + 1;
        });
        return count;
    }
    /* ----- UI Functions ----- */
    const handleShippingChange = () => {
        /* called on shipping checkbox change */
        // filter products
        setFilters(prevFilters => ({
            ...prevFilters,
            free_shipping_check: !filters.free_shipping_check,
            page: 1,
        }));
    }
    const handleClimateChange = () => {
        /* called on climate checkbox change */
        setFilters(prevFilters => ({
            ...prevFilters,
            climate_check: !filters.climate_check,
            page: 1,
        }));
    }
    const setCategory = (category, subCategory='') => {
        /* called on department press */
        setFilters(prevFilters => ({
            ...prevFilters,
            category:category,
            subCategory:subCategory,
            page: 1,
        }));
    }
    const set_rank_limit = (rank) => {
        /* called on rank limit button press */
        setFilters(prevFilters => ({
            ...prevFilters,
            rank_limit: rank,
            page: 1,
        }));
    }
    const handleBrandsChange = (brand) => {
        /* called on brand change */
        let new_brands = [...filters.brands, brand];
        if(filters.brands.some((b) => b === brand)) {
            // remove brand
            new_brands = filters.brands.filter((b) => { return b !== brand })
        }
        setFilters(prevFilters => ({
            ...prevFilters,
            brands: new_brands,
            page: 1,
        }));
    }
    const clear_brands = () => {
        setFilters(prevFilters => ({
            ...prevFilters,
            brands: [],
            page: 1,
        }));
    }

    const set_price_limit = (min, max=0) => {
        /* called on price limit button press */
        let dum_min = filters.dummy_min, dum_max = filters.dummy_max;
        if(min === 0 || min === -1) dum_min = dum_max = 0;
        setFilters(prevFilters => ({
            ...prevFilters,
            dummy_min:dum_min,
            dummy_max:dum_max,
            price_min:min,
            price_max:max,
            page: 1,
        }));
    }
    const setMin = (value) => {
        /* called on min price change */
        setFilters(prevFilters => ({
            ...prevFilters,
            dummy_min:value,
        }));
    }
    const setMax = (value) => {
        /* called on max price change */
        setFilters(prevFilters => ({
            ...prevFilters,
            dummy_max:value,
        }));
    }
    const setUsedCondition = (isUsed, isNew) => {
        /* called on condition checkbox change */
        setFilters(prevFilters => ({
            ...prevFilters,
            is_used:isUsed,
            is_new:isNew,
            page: 1,
        }));
    }
    const handleShowOutstockChange = () => {
        /* called on show out of stock checkbox change */
        setFilters(prevFilters => ({
            ...prevFilters,
            show_out_stock: !filters.show_out_stock,
            page: 1,
        }));
    }

    const toggleDepatments = () => {
        /* called on see more departments press */
        let numOfrows = 10;
        if(!rows.showAllCategories) {
            numOfrows = state.categories.length;
        }
        setRows(prevState => ({
            ...prevState,
            categoriesRows: numOfrows,
            showAllCategories: !rows.showAllCategories,
        }));
    }

    const toggleBrands = () => {
        /* called on see more brands press */
        let numOfrows = 7;
        if(!rows.showAllBrands) {
            numOfrows = state.brands.length;
        }
        setRows(prevState => ({
            ...prevState,
            brandsRows: numOfrows,
            showAllBrands: !rows.showAllBrands,
        }));
    }

    /* ----- Render ------ */
    const render_categories = () => {
        let department = [];
        let count = 0;
        for(let i = 0; i < rows.categoriesRows; i++){
            if(count >= rows.categoriesRows && !rows.showAllCategories) break;
            const category = state.categories[i];
            count += 1;
            department.push(
                <div key={i}>
                    <div className='ui-btn' onClick={()=>setCategory(category.name)}><span>{category.name}</span></div>
                    {
                        // render sub categories
                        ((c) => {
                            let subs = [];
                            let ind = c;
                            for(let j=0;j<category.sub_categories.length;j++) {
                                const sub = category.sub_categories[j];
                                
                                subs.push(
                                    <div key={j} onClick={()=>setCategory(category.name, sub)} className='ui-sub-btn'>
                                        <span>{sub}</span>
                                    </div>
                                )
                                if(!rows.showAllCategories) {
                                    ind++;
                                    if(ind >= rows.categoriesRows) break;
                                }
                            }
                            return(subs);
                        })(count)
                    }
                </div>
            )
            count += category.sub_categories.length;
        }
        if(state.categories.length > rows.categoriesRows) {
            department.push(
                <div key={count}>
                    <div className='ui-btn-toggle' onClick={toggleDepatments}><span>See All {calc_total_rows()} Departments</span></div>
                </div>
            )
        } else if(state.categories.length === rows.categoriesRows) {
            department.push(
                <div key={count}>
                    <div className='ui-btn-toggle' onClick={toggleDepatments}><span>See Fewer Departments</span></div>
                </div>
            )
        }
        return(department);
    }
    
    const render_department = (categoryName, subCategoryName='') => {
        const category = state.categories.find((cat) => cat.name === categoryName);
        return(
            <div>
                <div className={subCategoryName === '' ? 'ui-btn ui-btn-active' : 'ui-btn'} onClick={()=>setCategory(category.name)}><span>{category.name}</span></div>
                    {
                        // render sub categories
                        ((subName) => {
                            let subs = [];
                            for(let j=0;j<category.sub_categories.length;j++) {
                                const sub = category.sub_categories[j];
                                subs.push(
                                    <div key={j} onClick={()=>setCategory(category.name, sub)} className={sub === subName ? 'ui-sub-btn ui-btn-active': 'ui-sub-btn'}>
                                        <span>{sub}</span>
                                    </div>
                                )
                            }
                            return(subs);
                        })(subCategoryName)
                    }
                </div>
        )
    }

    const render_brands = () => {
        let brands = [];
        let count = 0;
        for(let i = 0; i < rows.brandsRows; i++){
            if(count >= rows.brandsRows && !rows.showAllBrands) break;
            const brand = state.brands[i];
            brands.push(
                <div key={i} className='brand'>
                    <input name='brand' type='checkbox' checked={filters.brands.some((b) => b === brand)} onChange={() => handleBrandsChange(brand)}/>
                    <label htmlFor="brand" className={filters.brands.some((b) => b === brand) ? 'ui-btn-active' : ''} onClick={() => handleBrandsChange(brand)}>{brand}</label>
                </div>
            )
            count+=1;
        };
        if(state.brands.length > rows.brandsRows) {
            brands.push(
                <div key={count}>
                    <div className='ui-btn-toggle' onClick={toggleBrands}><span>See More</span></div>
                </div>
            )
        } else if(state.brands.length === rows.brandsRows) {
            brands.push(
                <div key={count}>
                    <div className='ui-btn-toggle' onClick={toggleBrands}><span>See Less</span></div>
                </div>
            )
        }
        return(brands);
    }

    return(
        <div className='side-filters'>
            <div className='side-section'>
                <h4>Free Shipping</h4>
                <input name='shipping' type='checkbox' checked={filters.free_shipping_check} onChange={handleShippingChange}/>
                <label htmlFor="shipping" className={filters.free_shipping_check ? 'ui-btn-active':''} onClick={handleShippingChange}>Eligible for Free Shipping</label>
            </div>
            <div className='side-section'>
                <h4>Climate Pledge Friendly</h4>
                <input name='climate' type='checkbox' checked={filters.climate_check} onChange={handleClimateChange}/>
                <label htmlFor="climate" className={filters.climate_check ? 'ui-btn-active':''} onClick={handleClimateChange}>Climate Pledge Friendly</label>
            </div>
            <div className='side-section'>
                <h4>Department</h4>
                {
                    (filters.category !== '' || filters.subCategory !== '') && 
                    <div>
                        <div className="ui-btn" onClick={()=>setCategory('')}><img alt='' src='./images/left.png' height='14' width='14' /><span>Any Department</span></div>
                    </div>
                }
                {filters.category !== '' || filters.subCategory !== '' ? 
                    render_department(filters.category, filters.subCategory) 
                :  
                    render_categories()
                }
            </div>
            <div className='side-section'>
                <h4>Customer Reviews</h4>
                {
                    filters.rank_limit !== 0  && 
                    <div>
                        <div className="ui-btn" onClick={()=>set_rank_limit(0)}><img alt='' src='./images/left.png' height='14' width='14' /><span>Clear</span></div>
                    </div>
                }
                <div className='review-btn' onClick={()=>set_rank_limit(4)}>
                    <Stars rank='4' />
                    <span className={filters.rank_limit === 4 ? 'ui-btn-active':''}> & Up </span>
                </div>
                <div className='review-btn' onClick={()=>set_rank_limit(3)}>
                    <Stars rank='3' />
                    <span className={filters.rank_limit === 3 ? 'ui-btn-active':''}> & Up </span>
                </div>
                <div className='review-btn' onClick={()=>set_rank_limit(2)}>
                    <Stars rank='2' />
                    <span className={filters.rank_limit === 2 ? 'ui-btn-active':''}> & Up </span>
                </div>
                <div className='review-btn' onClick={()=>set_rank_limit(1)}>
                    <Stars rank='1' />
                    <span className={filters.rank_limit === 1 ? 'ui-btn-active':''}> & Up </span>
                </div>
            </div>
            <div className='side-section'>
                <h4>Brand</h4>
                {
                    filters.brands.length !== 0  && 
                    <div>
                        <div className="ui-btn" onClick={clear_brands}><img alt='' src='./images/left.png' height='14' width='14' /><span>Clear</span></div>
                    </div>
                }
                {render_brands()}
            </div>
            <div className='side-section'>
                <h4>Price</h4>
                {
                    filters.price_min !== -1  &&  filters.price_max !== -1 &&
                    <div>
                        <div className="ui-btn" onClick={() => set_price_limit(-1, -1)}><img alt='' src='./images/left.png' height='14' width='14' /><span>Clear</span></div>
                    </div>
                }
                <div className={filters.price_min === 0 && filters.price_max === 25 ? 'ui-btn ui-btn-active':'ui-btn'} onClick={() => set_price_limit(0, 25)}>
                    <span>Up to $25</span>
                </div>
                <div className={filters.price_min === 25 && filters.price_max === 50 ? 'ui-btn ui-btn-active':'ui-btn'}  onClick={() => set_price_limit(25, 50)}>
                    <span>$25 to $50</span>
                </div>
                <div className={filters.price_min === 50 && filters.price_max === 100 ? 'ui-btn ui-btn-active':'ui-btn'}  onClick={() => set_price_limit(50, 100)}>
                    <span>$50 to $100</span>
                </div>
                <div className={filters.price_min === 100 && filters.price_max === 200 ? 'ui-btn ui-btn-active':'ui-btn'} onClick={() => set_price_limit(100, 200)}>
                    <span>$100 to $200</span>
                </div>
                <div className={filters.price_min === 200 && filters.price_max === 0 ? 'ui-btn ui-btn-active':'ui-btn'}  onClick={() => set_price_limit(200)}>
                    <span>$200 & above</span>
                </div>
                <div className='price-ui'>
                    <input type='text' placeholder='Min' value={filters.dummy_min} onChange={(e) => setMin(e.target.value)} className='input-min-price'/>
                    <input type='text' placeholder='Max' value={filters.dummy_max} onChange={(e) => setMax(e.target.value)} className='input-max-price'/>
                    <button type='button' onClick={() => set_price_limit(filters.dummy_min, filters.dummy_max)}>Go</button>
                </div>
            </div>
            <div className='side-section'>
                <h4>Condition</h4>
                {
                    (filters.is_new || filters.is_used) && 
                    <div>
                        <div className="ui-btn" onClick={()=>setUsedCondition(false, false)}><img alt='' src='./images/left.png' height='14' width='14' /><span>Clear</span></div>
                    </div>
                }
                <div className={filters.is_new ? 'ui-btn ui-btn-active':'ui-btn'} onClick={() => setUsedCondition(false, true)}>
                    <span>New</span>
                </div>
                <div className={filters.is_used ? 'ui-btn ui-btn-active':'ui-btn'} onClick={() => setUsedCondition(true, false)}>
                    <span>Used</span>
                </div>
            </div>
            <div className='side-section'>
                <h4>Availability</h4>
                <input name='stock' type='checkbox' checked={filters.show_out_stock} onChange={handleShowOutstockChange}/>
                <label htmlFor="stock" className={filters.show_out_stock ? 'ui-btn-active' :''} onClick={handleShowOutstockChange}>Include Out of Stock</label>
            </div>
        </div>
    )
}

export default observer(SideFilters);