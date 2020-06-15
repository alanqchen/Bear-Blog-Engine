import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SCtheme from '../../../../assests/theme/SCtheme'
import API from '../../../../api';


const StyledCard = styled(Card)`
    margin-bottom: 10px;
    background-color: ${SCtheme.backgroundDarkAlt};
    transition: transform 0.2s ease-in-out !important;
    &:hover {
        cursor: pointer;
        transform: scale(1.008);
    }
`

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
