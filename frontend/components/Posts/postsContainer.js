import Link from 'next/link';
import Layout from '../../components/PublicLayout/publicLayout';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import React, { Component, Children, useEffect, useState } from 'react';
import Page from '../Posts/Page/page'
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components'
import PostCard from './Page/PostCard/postCard'
import API from '../../api'
import CloudOffIcon from '@material-ui/icons/CloudOff';
import { Typography } from '@material-ui/core';
import { StyledButton } from './postsContainerStyled'

const PostContainer = ({className, children}) => {
    return (
      <div className={className}>
        {children}
      </div>
    );
    
  }
  
const StyledPost = styled(PostContainer)`
width: 95%;
max-width: 800px;
`

function PostsContainer({ buildPosts }) {
    const [tempID, setTempID] = useState(-1);
    const [minID, setMinID] = useState(-1);
    const [children, setChildren] = useState([]);
    const [success, setSuccess] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [build, setBuild] = useState(true);
    const [done, setDone] = useState(false);
    const [toggleRetry, setToggleRetry] = useState(false);

    const loadMorePosts = () => {
        console.log("Loading more posts");
        console.log(tempID);
        setIsLoading(true);
        setMinID(tempID);
    };

    const retryLoad = () => {
        console.log("Trying to load again");
        console.log(tempID);
        setIsLoading(true);
        setMinID(tempID);
        setToggleRetry(!toggleRetry);
    }

    useEffect(() => {
        if (minID != -1) {
            
            const jsonBody = {
                maxID: minID.toString()
            }
            fetch(API.url+'/api/v1/posts/get', {
                method: 'post',
                body: JSON.stringify(jsonBody)
            })
            .then(res => res.json())
            .then(response => {
                if(response.success && response.data.length != 0) {
                    setPosts(response.data);
                    setTempID(response.pagination.minID);
                    setChildren(oldChildren => [...oldChildren, <Page posts={response.data}/>]);
                }
                setIsLoading(false);
                setSuccess(response.success && response.data.length != 0);
                setDone(response.success && response.data.length == 0);

            })
            .catch(error => {
                console.log(error);
                setSuccess(false);
                setDone(false);
                setIsLoading(false);
            });
        } else {
            if(buildPosts.success && buildPosts.data.length != 0) {
                setPosts(buildPosts.data);
                setTempID(buildPosts.pagination.minID);
                setChildren([<Page posts={buildPosts.data}/>]);
                setBuild(false);
                setIsLoading(false);
            }
            setSuccess(buildPosts.success && buildPosts.data.length != 0);
            setDone(buildPosts.success && buildPosts.data.length == 0)
        }
    }, [minID, toggleRetry]);

    return (
        <>

            {children.map((post, i) => (
                // Without the `key`, React will fire a key warning
                <StyledPost key={i}>
                    {post}
                </StyledPost>
            ))}
            {!isLoading && success 
                && <Waypoint onEnter={loadMorePosts}></Waypoint>
            }
            {isLoading &&  
                <>
                    <PostCard post={null} skeleton={true} />
                    <PostCard post={null} skeleton={true} />
                </>
            }
            {done &&
                <Typography align="center" fontWeight="fontWeightLight" variant="subtitle1" color="textSecondary" component="h1">
                    No more posts to show!
                </Typography>
            }
            {!success && !done && 
                <>
                    <CloudOffIcon />
                    <Typography align="center" fontWeight="fontWeightLight" variant="h6" color="textPrimary" component="h6">
                        Oops! Something went wrong. Check your internet connection and try again.
                    </Typography>
                    <StyledButton variant="contained" color="primary" onClick={() => {retryLoad()}}>
                        Try Again
                    </StyledButton>
                </>
            }
        </>
    )
}

// TODO: use getStaticProps

export default PostsContainer;
