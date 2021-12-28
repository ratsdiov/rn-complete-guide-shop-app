import Order from "../../models/orders";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            // Note method defaults to GET and header/body not needed so no second arg to fetch
            const response = await fetch(`https://rn-shop-app-a7346-default-rtdb.firebaseio.com/orders/${userId}.json`);
            if (!response.ok) {
                throw new Error('Bad response from fetchOrders fetch request');
            }

            const resData = await response.json();
            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)));
            }

        dispatch({ type: SET_ORDERS, orders: loadedOrders });
        } catch (err) {
            throw err;
        }
    };
};

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date().toISOString();
        const response = await fetch(`https://rn-shop-app-a7346-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date,
            })
        });

        if (!response.ok) {
            throw new Error('Error in addOrder!');
        }

        const resData = await response.json();

        // console.log('resdata', resData);

        dispatch({
            type: ADD_ORDER,
            orderData: { id: resData.name, items: cartItems, amount: totalAmount, date: date }
        });
    };
};