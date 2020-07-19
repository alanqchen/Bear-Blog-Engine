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

const Index = ({ setup, updatedAt }) => {
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
                    <StyledTextField label="Email" variant="outlined" 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <StyledTextField label="Password" type="password" variant="outlined" 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <WaveButton variant="contained" color="primary">
                        Login
                    </WaveButton>
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

export async function getStaticProps() {
    console.log("In static props");
    return {
        props: {
            ...await getSetup(),
            updatedAt: Date.now()
        },
        unstable_revalidate: 20
    };
};

export default Index;
