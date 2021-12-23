import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCT';

export const fetchProducts = () => {
    return async dispatch => {
        // Note method defaults to GET and header/body not needed so no second arg to fetch
        const response = await fetch("https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products.json");

        const resData = await response.json();
        const loadedProducts = [];

        // console.log('resdata', resData);

        for (const key in resData) {
            loadedProducts.push(new Product(key,
                'u1',
                resData[key].title,
                resData[key].imageUrl,
                resData[key].description,
                resData[key].price));
        }

        return dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    };
};

export const deleteProduct = productId => {
    return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async dispatch => {
        const response = await fetch("https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products.json", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price
            })
        });

        const resData = await response.json();

        // console.log('resdata', resData);

        dispatch({
            type: CREATE_PRODUCT,
            productData: { // Note the syntax below - same as title: title, etc
                id: resData.name,
                title,
                description,
                imageUrl,
                price
            }
        });
    };
};

export const updateProduct = (id, title, description, imageUrl) => {
    return {
        type: UPDATE_PRODUCT,
        pid: id,
        productData: { // Note the syntax below - same as title: title, etc
            title,
            description,
            imageUrl,
        }
    };
};