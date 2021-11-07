import { action, computed, makeAutoObservable, observable } from "mobx"
import { to_Decrypt } from "../aes.js";

class RootStore {
    constructor() {
        this.usersStore = new UsersStore(this)
        this.productsStore = new ProductsStore(this)
    }
}

class UsersStore {
    users = []
    constructor(rootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this, {  
            authUser:action,
            createUser:action,
            isEmailExists:action,
            getUser:action,
            updateName:action,
            updateEmail:action,
            updatePsw:action,
        });
    }

    updateName(id, name) {
        const userIndexAtId = this.users.findIndex((user) => user.id === id);
	    if (userIndexAtId > -1 ) {
	        this.users[userIndexAtId].name = name;
            return true;
        }
        return false;
    }

    updateEmail(id, email) {
        const userIndexAtId = this.users.findIndex((user) => user.id === id);
	    if (userIndexAtId > -1 ) {
	        this.users[userIndexAtId].email = email;
            return true;
        }
        return false;
    }

    updatePsw(id, old_psw, new_psw, re_psw) {
        const userIndexAtId = this.users.findIndex((user) => user.id === id);
	    if (
            userIndexAtId > -1 &&
            to_Decrypt(this.users[userIndexAtId].psw_hash) === to_Decrypt(old_psw) &&
            to_Decrypt(new_psw) === to_Decrypt(re_psw)
        ) {
            this.users[userIndexAtId].psw_hash = new_psw;
            this.users[userIndexAtId].re_psw_hash = re_psw;
            return true;
        }
        return false;
    }

    authUser(email, psw_hash) {
        const user_data = this.users.filter((u,i) => u.email === email);
        if(user_data.length && to_Decrypt(user_data[0].psw_hash) === to_Decrypt(psw_hash)) {
            return user_data[0];
        }
        return false;
    }

    createUser(user = {
        id:0,
        name:'',
        email:'',
        psw_hash:'',
        re_psw_hash:'',
        cart:[]
    }) {
        // check name
        if(user.name === '') return 0;
        // check if email exists
        if(this.isEmailExists(user.email)) return 1;
        // check psw & re_psw
        if(to_Decrypt(user.psw_hash) !== to_Decrypt(user.re_psw_hash)) return 2;
        // add user
        user.id = this.users.length;
        this.users.push(user);
        return user;
    }

    getUser(uid) {
        const user = this.users.filter((u,i) => u.id === uid)[0];
        if(user === undefined) return;
        return {
            uid:user.id,
            name:user.name,
            email:user.email,
            cart:user.cart,
        }
    }

    isEmailExists(email) {
        // check if email exists
        return this.users.some((u) => u.email === email);
    }
}

class ProductsStore {
    products = []
    preview_products = []
    departments = []
    brands = []
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this, { 
            rootStore: false,
            preview_products: observable,
            departments:observable,
            brands:observable,
            totalProducts: computed,
            storeDetails: computed,
            createProduct: action,
            updateProduct: action,
            deleteProduct: action,
            logStoreDetails:action,
            getPreviewProducts:action,
            getDepartments:action,
            getBrands:action,
            searchProduct:action,
        })
        
        this.rootStore = rootStore;
        //autorun(this.logStoreDetails);
    }

    // total number of products
    get totalProducts() {
	    return this.products.length;
    }

    // create product
    createProduct(product = { 
        id: 0, 
        name:"", 
        brand:"",
        price: "", 
        free_shipping:false, 
        climate_friendly: false, 
        reviews:[], 
        categories:[], 
        img:"", 
        used: false, 
        stock: 0 
    }) {
	    this.products.push(product);
        // check for new department & sub categories
        const new_departments = product.categories.filter((category) => {
            const department_exists = this.departments.some((d) => {
                if(d.name === category.name) {
                    // check sub categories
                    let new_sub_categories = category.sub_categories.filter(sub => !d.sub_categories.some(sub2 => sub === sub2));
                    // add new sub categories
                    d.sub_categories = [...d.sub_categories,...new_sub_categories]
                    return true;
                }
                return false;
            });
            if(department_exists) {
                //categories = [...categories,...current_categories];
                return false;
            }
            return true;
        } )
        // add new departments
        this.departments = [...this.departments, ...new_departments];
            
        // check for new brands 
        if (this.brands.indexOf(product.brand) === -1) {
            this.brands.push(product.brand);
        }

        return product;
    }
    
    // get products
    getPreviewProducts(filters, maxNumOfItems = 10) {
        const currentIndex = (filters.page - 1) * maxNumOfItems;
        
        // interate products until count equals to maxNumOfItems
        // interate some of products, until count equals to maxNumOfItems, maybe more efficent
        /*
        let count = 0;
        this.preview_products = [];
        while(count <= maxNumOfItems) {
            if(this.products.length - 1 < currentIndex) break;
            const product = this.products[currentIndex];
            if(this.productFiltersCheck(product, filters)) {
                // product meets filters demands
                this.preview_products.push(product);
                count++;
            }
            currentIndex++;
        }
        */
        // iterate all products
        let preview = [];
        if(filters.search_value !== '') {
            preview = this.searchProduct(filters.search_value).filter((p) => this.productFiltersCheck(p, filters));
        } else {
            preview = this.products.filter((p) => this.productFiltersCheck(p, filters));
        }
        this.preview_products = this.sortProducts(filters.sort, preview);
        
        let endIndex = currentIndex + maxNumOfItems;
        if(endIndex > this.preview_products - 1) endIndex = this.preview_products.length - 1;
        return this.preview_products.slice(currentIndex, endIndex);
    }
    // product filters check
    productFiltersCheck(product, { 
        free_shipping_check,
        climate_check,
        price_min,
        price_max,
        is_used,
        is_new,
        show_out_stock,
        rank_limit,
        category,
        subCategory,
        brands,
    }) {
        // rank filter
        if(product.rank < rank_limit) return false;
        // shipping filter
        if(free_shipping_check && !product.free_shipping) return false;
        // climate filter
        if(climate_check && !product.climate_friendly) return false;
        // used condition filter
        if(is_used && !product.used) return false;
        // new condition filter
        if(is_new && product.used) return false;
        // out of stock filter
        if(!show_out_stock && product.stock === 0) return false;
        // filter brands
        if(brands.length && brands.indexOf(product.brand) === -1) return false;
        // filter min price
        if(price_min > 0 && product.price < price_min) return false;
        // filter max price
        if(price_max > 0 && product.price > price_max) return false;
        // filter category & sub category
        if(subCategory !== '' && !product.categories.some(cat => cat.name === category && cat.sub_categories.indexOf(subCategory) > -1)) {
            return false;
        } else if(category !== '' && !product.categories.some(cat => cat.name === category)) {
            return false;
        }
        return true;
    }
    // get departments
    getDepartments() {
        return this.departments;
    }
    
    // get preview brands
    getBrands() {
        return this.brands;
    }
    // sort preview
    sortProducts(sort, products) {
        // 0 - featured, 1 - Low to High, 2 - High to Low, 3 - Avg, 4 - new
        if(sort === '1') {
            products.sort((a, b) => {
                return a.price - b.price;
            });
        } else if(sort === '2') {
            products.sort((a, b) => {
                return b.price - a.price;
            });
        } else if(sort === '3') {
            products.sort((a, b) => {
                return b.reviews.length - a.reviews.length;
            });
        } else if(sort === '4') {
            products.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        } else {
            products.sort((a, b) => {
                return a.id - b.id;
            });
        }
        return products;
    }
    // search for product
    searchProduct(value) {
        // check if value in name
        const search_products = this.products.filter((product, i) => {
            // name check
            if(product.name.toLowerCase().indexOf(value.trim().toLowerCase()) > -1){
                return true;
            }
            // category & sub category check
            const category_exists = !product.categories.some((cat) => {
                if(cat.name.toLowerCase().indexOf(value.trim().toLowerCase()) > -1) {
                    const exists_in_subs = !cat.sub_categories.some((sub) => sub.toLowerCase().indexOf(value.trim().toLowerCase()) > -1);
                    if(exists_in_subs) {
                        return false;
                    }
                    return true;
                } 
                return false;
            });
            if(category_exists) return false;
            // brand check
            if(product.brand.toLowerCase().indexOf(value.trim().toLowerCase()) === -1) return false;
            return true;
        });

        return search_products;
    }
    // update product
    updateProduct(productId, update) {
        const productIndexAtId = this.products.findIndex((product) => product.id === productId);
	    if (productIndexAtId > -1 && update) {
	        this.products[productIndexAtId] = update;
        }
    }
    // delete product by id
    deleteProduct(productId) {
        const productIndexAtId = this.products.findIndex((product) => product.id === productId);
        if (productIndexAtId > -1) {
            this.products.splice(productIndexAtId, 1)
        }
    }
    // get store details
    get storeDetails () {
        return `Store contain ${this.totalProducts()} products.`
    }
    // Log the store details to the console
    logStoreDetails() {
        console.log(this.storeDetails);
    }
}

export default RootStore