import fetch from 'isomorphic-unfetch'
import React, {useState} from 'react';
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress';
import {StyledImage, StyledImageWrapper, FeatureImageWrapper, StyledLinearProgressWrapper, TagsWrapper, StyledChip, ImageSkeleton} from './postCardStyled'
import API from '../../../../api'
import { Skeleton } from '@material-ui/lab';

function FeatureImage({featureImgUrl, tags, skeleton}) {

    const [loading, setLoading] = useState(true);

    return (
        <FeatureImageWrapper>
            {!skeleton && loading 
                &&  <>
                        <StyledLinearProgressWrapper><LinearProgress /></StyledLinearProgressWrapper>
                        <ImageSkeleton variant="rect" width="100%" height="300px" />
                    </>
            }
            <TagsWrapper>
            {!skeleton && tags.map((tag, i) => (
                <StyledChip size="small" clickable label={tag} key={i}/>
            ))}
            </TagsWrapper>
            <StyledImageWrapper>
                {skeleton ? <Skeleton variant="rect" width="100%" height="300px"/>
                :
                <picture>
                    {featureImgUrl.substring(featureImgUrl.length - 5, featureImgUrl.length) == ".jpeg" 
                        ? <source srcSet={API.url + featureImgUrl.substring(0, featureImgUrl.length - 5) + ".webp"} />
                        : <source srcSet={API.url + featureImgUrl.substring(0, featureImgUrl.length - 4) + ".webp"} />
                    }
                    <StyledImage src={API.url + featureImgUrl} onLoad={() => setLoading(false)} />
                </picture>
                } 
            </StyledImageWrapper>
        </FeatureImageWrapper>
    )

}

export default FeatureImage;
