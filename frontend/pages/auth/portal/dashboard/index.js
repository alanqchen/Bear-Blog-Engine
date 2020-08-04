import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/DashboardLayout/dashboardLayout';
import { refresh, setTokens } from '../../../../redux/auth/actions';

const Index = ({ auth, dispatch }) => {

    const [initAuth, setInitAuth] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("bearpost.JWT");
        const refreshToken = localStorage.getItem("bearpost.REFRESH");
        if(accessToken) {
            const getNewRefreshToken = async() => {
                await dispatch(setTokens(accessToken, refreshToken));
                await dispatch(refresh())
            }

            getNewRefreshToken();
        }
    
        setInitAuth(true);
    }, []);

    if(auth.accessToken != "") {
        localStorage.setItem("bearpost.JWT", auth.accessToken);
        localStorage.setItem("bearpost.REFRESH", auth.refreshToken);
    }

    return (
        <Layout>
            <h1>You're logged in!</h1>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        auth: {
            accessToken: state.auth.accessToken,
            refreshToken: state.auth.refreshToken,
            userData: state.auth.userData,
            loading: state.auth.loading,
            error: state.auth.error
        },
    }
}

export default connect(mapStateToProps)(Index);
