import HomePage from './pages/home/home';
import SigninPage from './pages/signin/signin';
import RegisterPage from './pages/register/register';
import ProfilePage from './pages/profile/profile';
import './App.css';
import {  HashRouter  as Router, Switch, Route } from "react-router-dom";
import RootStore from './store/rootStore';
import React, { useState, useEffect } from 'react';
import { products } from './data.json'
import { calc_rank } from './utils';

// mobx store object
const store = new RootStore();

const App = () => {
  /* ----- State ------ */
  const [state, setState] = useState({
    products: [],
    location:'Israel',
    currency: '$',
    categories:[],
    brands:[],
    maxNumOfItems: 20,
    numOfPages: 0,
    user: undefined,
  });
  const [filters, setFilters] = useState({
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
  /* ----- Load products to store from json file ------ */
  const load_products = () => {
    products.forEach((product, i) => {
        product.rank = calc_rank(product.reviews);
        store.productsStore.createProduct(product);
    });
  }
  /* ----- Render ------ */
  useEffect(() => {
    // on app load 
    // insert product to store from json file
    load_products();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={['/', '/search']} render={() => <HomePage store={store} state={state} setState={setState} filters={filters} setFilters={setFilters}/>} />
          <Route path='/signin' render={() => <SigninPage store={store} state={state} setState={setState} />} />
          <Route path='/register' render={() => <RegisterPage store={store} />} />
          <Route path='/profile/:uid' render={() => <ProfilePage store={store} state={state} setState={setState} filters={filters} setFilters={setFilters}/>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
