import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const EditProductScreen = (props) => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(
        state => state.products.userProducts.find(prod => prod.id === prodId)
    );
    const dispatch = useDispatch();

    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [titleIsValid, setTitleIsValid] = useState(false);
    const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

    const submitHandler = useCallback(() => {
        // console.log('Submitting', title);
        if (!titleIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (editedProduct) {
            dispatch(productsActions.updateProduct(prodId, title, description, imageUrl));
        } else {
            // Note +price converts string to number
            dispatch(productsActions.createProduct(title, description, imageUrl, +price));
        }
        props.navigation.goBack();
    }, [dispatch, prodId, title, description, imageUrl, price]);

    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);

    const titleChangeHandler = (text) => {
        console.log(text);
        if (text.trim().length === 0) {
            setTitleIsValid(false);
        } else {
            setTitleIsValid(true);
        }

        setTitle(text);
    };


    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={titleChangeHandler}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                    />
                    {!titleIsValid && <Text>Please enter a valid title!</Text>}
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>ImageUrl</Text>
                    <TextInput
                        style={styles.input}
                        value={imageUrl}
                        onChangeText={text => setImageUrl(text)}
                        keyboardType='decimal-pad'
                    />

                </View>
                {editedProduct ? null : (
                    <View style={styles.formControl}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={text => setPrice(text)}
                        />
                    </View>
                )}
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default EditProductScreen;

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>,

    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    formControl: {
        width: '100%',
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,

    }
});
