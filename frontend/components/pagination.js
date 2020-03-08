import Link from 'next/link';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';

const useStyles = makeStyles({
root: {
    minWidth: 275,
},
bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
},
title: {
    fontSize: 14,
},
pos: {
    marginBottom: 12,
},
});

const StyledCard = styled(Card)`
    margin-bottom: 10px;
    transition: transform 0.2s ease-in-out !important;
    &:hover {
        cursor: pointer;
        transform: scale(1.008);
    }
`

const PostCardLink = React.forwardRef((props, ref) => (
<a ref={ref} {...props}>
    
</a>
))
    
const PostCard = ({ post }) => {
    return(
        <StyledCard>
            <CardContent>
                <img src={post.featureImgUrl}></img>
                <Typography color="textPrimary" gutterBottom>
                    {post.title}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
        };
    }
    render() {
        const { posts } = this.state;
        if( posts == null) return null;
        console.log(this.state.posts);
        return (
            <>
                {posts.map(post => (
                <React.Fragment key={post.id}>
                <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`}>
                    <PostCardLink post={post}>
                        <PostCard post={post}></PostCard>
                    </PostCardLink>
                </Link>
                </React.Fragment>
                ))}
            </>
        );
    }
}
export default Pagination;
