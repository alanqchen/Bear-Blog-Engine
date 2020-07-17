import { Typography } from '@material-ui/core';
import Layout from '../../../../components/PublicLayout/publicLayout';
import { HeaderWrapper } from '../../../../components/PublicLayout/publicLayoutStyled';
import {
    StyledLoginPaper,
    LoginPaperWrapper,
    StyledTextField
} from '../../../../components/Login/loginStyled';
import Particles from 'react-particles-js';

const Index = ({ numUsers }) => {
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
                            Login
                        </Typography>
                    </HeaderWrapper>
                    <StyledTextField label="email" variant="filled" />
                    <StyledTextField label="password" type="password" variant="filled" />
                </StyledLoginPaper>
            </LoginPaperWrapper>
        </Layout>
        </>
    );
};

export default Index;
