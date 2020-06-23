import Link from 'next/link';
import Layout from '../../components/PublicLayout/publicLayout';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import React, { Component, Children, useEffect, useState } from 'react';
import Page from '../Posts/Page/page'
import Spinner from '@atlaskit/spinner';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress';
import {StyledCard} from './Page/PostCard/postCardStyled'
import API from '../../api'
import { responsiveFontSizes } from '@material-ui/core';

const PostContainer = ({className, children}) => {
    return (
      <div className={className}>
        {children}
      </div>
    );
    
  }
  
const StyledPost = styled(PostContainer)`
width: 95%;
max-width: 900px;
`

function PostsContainer({ buildPosts }) {
    const [tempID, setTempID] = useState(-1);
    const [minID, setMinID] = useState(-1);
    const [children, setChildren] = useState([]);
    const [success, setSuccess] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [build, setBuild] = useState(true);

    const loadMorePosts = () => {
        console.log("Loading more posts");
        console.log(tempID);
        setIsLoading(true);
        setMinID(tempID);
    };


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

            })
            .catch(error => console.log(error));
        } else {
            if(buildPosts.success && buildPosts.data.length != 0) {
                setPosts(buildPosts.data);
                setTempID(buildPosts.pagination.minID);
                setChildren([<Page posts={buildPosts.data}/>]);
                setBuild(false);
                setIsLoading(false);
            }
            setSuccess(buildPosts.success && buildPosts.data.length != 0);
        }
    }, [minID]);

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
            {isLoading
                && <Spinner invertColor="true" size="xlarge"/>
            }
        </>
    )
}

// TODO: use getStaticProps

export default PostsContainer;
