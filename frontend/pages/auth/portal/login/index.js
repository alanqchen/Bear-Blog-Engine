import { Typography, InputAdornment } from '@material-ui/core';
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
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const Index = ({ setup, updatedAt }) => {
    /*
    tryLogin = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: 'post'
        })
    }
    */

    const timeString = new Date(updatedAt).toLocaleTimeString();
    return (
        <>
        <Particles params={{
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 1500
                    }
                },
                "line_linked": {
                    "enable": true,
                    "opacity": 0.02
                },
                "move": {
                    "direction": "right",
                    "speed": 0.05
                },
                "size": {
                    "value": 1
                },
                "opacity": {
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.05
                    }
                }
            },
            "interactivity": {
                "events": {
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    }
                },
                "modes": {
                    "push": {
                        "particles_nb": 1
                    }
                }
            },
            "retina_detect": true
	    }} style={{ position: "absolute", top: 0 }} />
        <Layout> 
            <LoginPaperWrapper>
                <StyledLoginPaper>
                    <HeaderWrapper>
                        <Typography align="center" fontWeight="fontWeightLight" variant="h3" color="textPrimary" component="h4">
                            {timeString}
                        </Typography>
                    </HeaderWrapper>
                    <LoginForm />
                </StyledLoginPaper>
            </LoginPaperWrapper>
        </Layout>
        </>
    );
};

async function getSetup() {
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`);
    const users = await res.json();
    const errorCode = users.status > 200 ? users.status : false;
    if(errorCode || users.data.length !== 0) {
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
            ...await getSetup(),
            updatedAt: Date.now()
        }
    };
};

export default Index;
