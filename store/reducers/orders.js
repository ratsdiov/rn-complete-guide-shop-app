import { ADD_ORDER, SET_ORDERS } from "../actions/orders";
import Order from "../../models/orders";

const initialState = {
    orders: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {
                orders: action.orders,
            }
        case ADD_ORDER:  // Note handled here and also in the cart reducer (to clear the cart)
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date,
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
    }
    return state;
};