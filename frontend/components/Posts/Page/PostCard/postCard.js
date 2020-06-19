import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SCtheme from '../../../../assests/theme/SCtheme'
import {StyledImageWrapper, StyledCard} from './postCardStyled'
import LazyLoad from 'react-lazyload'
import FeatureImage from './featureImage'
import API from '../../../../api';

export const PostCard = ({ post }) => {
    return(
        <StyledCard>
            <CardContent>
                <LazyLoad height={'400px'} >
                    <StyledImageWrapper>
                        <FeatureImage featureImgUrl={post.featureImgUrl} />
                    </StyledImageWrapper>
                </LazyLoad>
                <Typography color="textPrimary" gutterBottom>
                    {post.title}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}
