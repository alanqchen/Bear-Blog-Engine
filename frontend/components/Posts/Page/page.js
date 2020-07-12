import Link from 'next/link';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../PublicLayout/publicLayout';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import SCtheme from '../../../assets/theme/SCtheme';
import { PostCard } from './PostCard/postCard';
import { PostCardLink } from './pageStyled';

function Pagination({posts}) {
    return (
        <>
            {posts.map(post => (
            <React.Fragment key={post.id}>
                <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`} passHref>
                    <PostCardLink post={post}>
                        <PostCard post={post} skeleton={false}></PostCard>
                    </PostCardLink>
                </Link>
            </React.Fragment>
            ))}
        </>
    );
}
export default Pagination;
