import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './navbar.scss';


const NavBar = ({ state, filters, setFilters }) => {
    /* ----- State ------ */
    const [color, setColor] = useState("#131921");
    /* ----- Navigation ----- */
    let history = useHistory();
    const goToHome = () => {
        // reset filters
        setFilters({
            free_shipping_check: false,
            climate_check: false,
            price_min:-1,
            price_max:-1,
            dummy_min:0,
            dummy_max:0,
            is_used:false,
            is_new:false,
            show_out_stock:false,
            rank_limit: 0,
            category:'',
            subCategory:'',
            brands:[],
            page: 1,
            sort:0,
            dummy_search:'',
            search_value: '',
        });
        history.push({pathname:'/'});
    }
    const goToUser = () => {
        console.log(state);
        if(state.user === undefined) history.push('/signin');
        else history.push({
            pathname:'/profile/:'+ state.user.id,
        });
    }
    /* ----- UI Functions ----- */
    
    const on_search = () => {
        history.push({
            pathname:'/search',
            search: '?query=' + filters.dummy_search,
        });
        setFilters(prevFilters => ({
            ...prevFilters,
            search_value: filters.dummy_search,
        }));
    }
    const setSearch = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            dummy_search: value,
        }));
    }
    const handleDepartmentChange = (e) => {
        let department = e.target.value;
        if(department === 'All') department = '';
        setFilters(prevFilters => ({
            ...prevFilters,
            category: department,
        }));
    }
    /* ----- Render ------ */
    const render_categories = () => {
        return state.categories.map( (category, i) => {
            return(
                <option key={i}>{category.name}</option>
            )
        });
    }

    return(
        <div className="navigation-bar">
            <div className='navbar'>
                <div className='nav-item store-logo' onClick={goToHome}>
                    <span>Logo</span>
                </div>
                <div className='nav-item location'>
                    <div className='location-icon'>
                        <img alt='pin' src='mobx-store-demo/images/pin.png' height='18' width='18'/>
                    </div>
                    <div className="location-txt">
                        <span>Deliver to</span>
                        <span className='span-bold'>{state.location}</span>
                    </div>  
                </div>
                <div className='search' style={{border: "3px solid "+ color}}>
                    <div className='search-category'>
                        <select className='category-select' value={filters.category} onChange={handleDepartmentChange}>
                            <option value=''>All</option>
                            {render_categories()}
                        </select>
                    </div>
                    <div className='search-input'>
                        <input className='nav-input' type="text" value={filters.dummy_search} onKeyDown={(e) => e.key === 'Enter' ? on_search() : null} onFocus={() => setColor('#febd69')} onBlur={() => setColor('#131921')} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className='search-btn'>
                        <button type='button' onClick={on_search} className='searchBtn'><img alt='search' src='mobx-store-demo/images/search.png' height='15' width='15' /></button>
                    </div>
                </div>
                <div className='nav-item language'>
                    <img alt='IL' src='mobx-store-demo/images/il.png' height='25' width='25' />
                </div>
                <div className='nav-item signin' onClick={goToUser}>
                    {
                        state.user !== undefined ? 
                            <span>Hello, {state.user.name}</span>
                        :
                            <span>Hello, Sign in</span>
                    }
                    <span className='span-bold'>Account & Lists</span>
                </div>
                <div className='nav-item orders'>
                    <span>Returns</span>
                    <span className='span-bold'>& Orders</span>
                </div>
                <div className='nav-item cart'>
                    <div className='cart-icon'>
                        <span>0</span>
                        <img alt='' src='mobx-store-demo/images/cart.png' height='20' width='20' />
                    </div>
                    <div className='cart-txt'>
                        <span className='span-bold'>Cart</span>
                    </div>
                </div>
            </div>
            <div className='sub-navbar'>
                <div>
                    <img alt="" src="mobx-store-demo/images/menu.png" height='15' width='15' />
                    All
                </div>
                <div>
                    Today's Deals
                </div>
                <div>
                    Customer Service
                </div>
                <div>
                    Registry
                </div>
                <div>
                    Gift Cards
                </div>
                <div>
                    Sell
                </div>
            </div>
        </div>
    )
}
export default NavBar