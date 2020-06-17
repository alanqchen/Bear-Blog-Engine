import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SCtheme from '../../../../assests/theme/SCtheme'
import {StyledCard} from './postCardStyled'
import API from '../../../../api';

export const PostCard = ({ post }) => {
    return(
        <StyledCard>
            <CardContent>
                <img src={API.url + post.featureImgUrl}></img>
                <Typography color="textPrimary" gutterBottom>
                    {post.title}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}
