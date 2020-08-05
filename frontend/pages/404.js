import Layout from '../components/PublicLayout/publicLayout';
import { useRouter } from 'next/router'
import { WaveButton, ErrorWrapper } from '../components/Theme/StyledComponents';
import Lottie from 'react-lottie';
import { Typography } from '@material-ui/core';
import Icon404Data from '../components/Theme/404Icon.json';

export default function Custom404() {
    const router = useRouter()

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: Icon404Data,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Layout>
            <ErrorWrapper>
                <Lottie options={defaultOptions}
                width={"90%"}
                isStopped={false}
                isPaused={false}
                isClickToPauseDisabled={true}
                style={{maxWidth: "400px"}}
                />
                <Typography fontWeight="fontWeightLight" color="textSecondary" variant="subtitle1" component="h1">404 - Page Not Found</Typography>
                <Typography fontWeight="fontWeightRegular" variant="h5" component="h2" display="block" gutterBottom>You're lost in the cosmos!</Typography>
                <WaveButton onClick={()=>{router.push("/")}}>To Safety</WaveButton>
            </ErrorWrapper>
        </Layout>
    );
}

