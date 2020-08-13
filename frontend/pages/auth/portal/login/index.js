import { connect } from 'react-redux';
import Router from "next/router";
import { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import { Person, Lock } from '@material-ui/icons';
import Particles from 'react-particles-js';
import Layout from '../../../../components/PublicLayout/publicLayout';
import { HeaderWrapper } from '../../../../components/PublicLayout/publicLayoutStyled';
import {
    StyledLoginPaper,
    LoginPaperWrapper,
    StyledTextField,
    InnerWrapper
} from '../../../../components/Login/loginStyled';
import { WaveButton } from '../../../../components/Theme/StyledComponents';
import fetch from 'isomorphic-unfetch';
import LoginForm from '../../../../components/Login/loginForm';
import SetupForm from '../../../../components/Login/setupForm';
import StarParticles from '../../../../components/Theme/particles.json';

const Index = ({ data, auth }) => {

    useEffect(() => {
        const token = localStorage.getItem("bearpost.JWT");
        if(token && !data.setup) {
            Router.push("/auth/portal/dashboard");
        }
    }, []);

    return (
        <>
            {!auth.accessToken && <Particles params={StarParticles} style={{ position: "absolute", top: 0 }} />}
            <Layout> 
                <LoginPaperWrapper>
                    <StyledLoginPaper>
                        { data.setup ? 
                        <SetupForm />
                        :
                        <LoginForm />
                        }
                    </StyledLoginPaper>
                </LoginPaperWrapper>
            </Layout>
        </>
    );
};

async function getSetup() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`);
    const users = await res.json();
    const errorCode = users.status > 200 ? users.status : false;
    if(errorCode || (users.data && users.data.length !== 0)) {
        return {
            data: {
                errorCode: errorCode,
                setup: false
            }
        }
    }

    return {
        data: {
            errorCode: errorCode,
            setup: true,
        }
    };
}

export async function getServerSideProps() {

    return {
        props: {
            ...await getSetup()
        }
    };
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
