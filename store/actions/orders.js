export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems, totalAmount) => {
    return async dispatch => {
        const date = new Date().toISOString();
        const response = await fetch("https://rn-shop-app-a7346-default-rtdb.firebaseio.com/orders/u1.json", {
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
}