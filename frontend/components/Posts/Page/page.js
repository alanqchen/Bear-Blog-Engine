import Link from 'next/link';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../PublicLayout/publicLayout';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import SCtheme from '../../../assests/theme/SCtheme'
import API from '../../../api';
import {PostCard} from './PostCard/postCard'

const PostCardLink = React.forwardRef((props, ref) => (
<a ref={ref} {...props}>
    
</a>
))

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
