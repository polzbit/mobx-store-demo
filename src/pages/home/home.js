import React, {  useEffect } from 'react';
import NavBar from '../../components/navbar/navbar';
import StoreContent from '../../components/storeContent/storeContent';
import './home.scss';
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";

const HomePage = ({store, state, setState, filters, setFilters}) => {
    /* ----- Navigation ------ */
    const location = useLocation();
    /* ----- Render ------ */
    const updateProducts = () => {
        // update preview products
        const products = store.productsStore.getPreviewProducts(filters, state.maxNumOfItems);
        const numOfPages = Math.ceil(store.productsStore.preview_products.length / state.maxNumOfItems);
        // extract departments and sub departments from preview products data
        const departments = store.productsStore.getDepartments();
        const brands = store.productsStore.getBrands();
        setState(prevState => ({
            ...prevState,
            products: products,
            numOfPages: numOfPages,
            categories: departments,
            brands: brands,
        }));
    }

    useEffect(() => {
        // on page load 
        // set filters parameters from link
        let search = filters.search_value;
        if(location.pathname === '/search')  {
            location.search.substring(1).split('&').forEach((q,i) => {
                const qdata = q.split('=');
                console.log(qdata);
                if(qdata[0] === 'query') {
                    // set search value
                    search = qdata[1];
                }
                
            });
        }
        // update filters
        setFilters(prevFilter => ({
            ...prevFilter,
            search_value: search,
            dummy_search: search,
        }));
        // update preview products
        updateProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    useEffect(() => {
        // on filtars change 
        // update preview products
        updateProducts();
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return(
        <div className='home'>
            <NavBar state={state} filters={filters} setFilters={setFilters}/>
            <StoreContent state={state} filters={filters} setFilters={setFilters}/>
        </div>
    )
}

export default observer(HomePage);