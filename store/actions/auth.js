export const SIGNUP = 'SIGNUP';

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB-FOnyzYmtc-LwHckWlCPWa5TvCee8xMU',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true,
                })
            }
        );


        if (!response.ok) {
            throw new Error('Error in signup http call');
        }

        const resData = await response.json();
        console.log(resData);

        dispatch({ type: SIGNUP });

    };
};