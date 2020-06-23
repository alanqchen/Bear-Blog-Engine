import fetch from 'isomorphic-unfetch'
import React, {useState} from 'react';
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress';
import {StyledImage, StyledImageWrapper} from './postCardStyled'
import API from '../../../../api'

function FeatureImage({featureImgUrl}) {

    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <LinearProgress />}
            <StyledImageWrapper>
                <picture>
                    {featureImgUrl.substring(featureImgUrl.length - 5, featureImgUrl.length) == ".jpeg" 
                        ? <source srcSet={API.url + featureImgUrl.substring(0, featureImgUrl.length - 5) + ".webp"} />
                        : <source srcSet={API.url + featureImgUrl.substring(0, featureImgUrl.length - 4) + ".webp"} />
                    }
                    <StyledImage src={API.url + featureImgUrl} onLoad={() => setLoading(false)} />
                </picture>
            </StyledImageWrapper>
        </>
    )

}

export default FeatureImage;
