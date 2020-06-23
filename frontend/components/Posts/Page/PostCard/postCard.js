import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SCtheme from '../../../../assets/theme/SCtheme'
import {StyledImageWrapper, StyledCard} from './postCardStyled'
import FeatureImage from './featureImage'
import API from '../../../../api';

export const PostCard = ({ post }) => {

    return(
        <StyledCard>
            <CardContent>
                <FeatureImage featureImgUrl={post.featureImgUrl} />
                <Typography color="textPrimary" gutterBottom>
                    {post.title}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}
