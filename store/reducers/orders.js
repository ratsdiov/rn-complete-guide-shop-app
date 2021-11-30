import { ADD_ORDER } from "../actions/orders";
import Order from "../../models/orders";

const initialState = {
    orders: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER:  // Note handled here and also in the cart reducer (to clear the cart)
            const newOrder = new Order(
                new Date().toString(),
                action.orderData.items,
                action.orderData.amount,
                new Date()
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
    }
    return state;
};