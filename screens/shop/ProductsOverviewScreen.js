import React, { useEffect, useState, useCallback } from 'react';
import { Text, FlatList, Platform, StyleSheet, Button, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import { Header } from 'react-native/Libraries/NewAppScreen';

import Colors from '../../constants/Colors';

const ProductsOverviewScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadProducts();
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title,
        });
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred: {error} </Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primary} />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found.  Maybe start adding some!</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                >
                    <Button
                        color={Colors.primary}
                        title="View Details"
                        onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                    />
                    <Button
                        color={Colors.primary}
                        title="To Cart"
                        onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                    />
                </ProductItem>
            )}
        />
    );
};
// Note use of function form for options to allow handling onPress, see lesson 173, 12:30
ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>,
        headerRight: () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'ios-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
    };
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
