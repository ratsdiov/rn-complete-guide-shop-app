import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCT';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            // Note method defaults to GET and header/body not needed so no second arg to fetch
            const response = await fetch("https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products.json");
            if (!response.ok) {
                throw new Error('Bad response from fetchProducts fetch request');
            }

            const resData = await response.json();
            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(new Product(key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price));
            }

            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId),
            });
        } catch (err) {
            throw (err);
        }
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Bad response from deleteProduct fetch request');
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId,
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
                price,
                ownerId: userId,
            }
        });
    };
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // Note no need to store response
        const response = await fetch(`https://rn-shop-app-a7346-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
            })
        });

        if (!response.ok) {
            console.log('error');
            throw new Error('Bad response from updateProduct fetch request');
        }
        // const resData = await response.json();

        // console.log('resdata', resData);

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: { // Note the syntax below - same as title: title, etc
                title,
                description,
                imageUrl,
            }
        });
    };

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