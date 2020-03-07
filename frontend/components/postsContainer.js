import Link from 'next/link';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import React, { Component, Children, useEffect, useState } from 'react';
import Pagination from '../components/pagination'
import Spinner from '@atlaskit/spinner';
import { Waypoint } from 'react-waypoint';

function PostsContainer() {
    const [tempID, setTempID] = useState(-1);
    const [minID, setMinID] = useState(-1);
    const [children, setChildren] = useState([]);
    const [success, setSuccess] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadMorePosts = () => {
        console.log("Loading more posts");
        console.log(tempID);
        setIsLoading(true);
        setMinID(tempID);
    };

    useEffect(() => {
        const jsonBody = {
            maxID: minID.toString()
        }
        fetch('http://localhost:8080/api/v1/posts/get', {
            method: 'post',
            body: JSON.stringify(jsonBody)
        })
        .then(res => res.json())
        .then(response => {
            if(response.success) {
                setPosts(response.data);
                setTempID(response.pagination.minID);
                setChildren(oldChildren => [...oldChildren, <Pagination posts={response.data}/>])
            }
            setIsLoading(false);
            setSuccess(response.success);

        })
        .catch(error => console.log(error));
    }, [minID]);

    return (
        <>
            
            <h1>a</h1>
            {children.map((post, i) => (
                // Without the `key`, React will fire a key warning
                <React.Fragment key={i}>
                    {post}
                </React.Fragment>
            ))}
            {!isLoading && success && <Waypoint onEnter={loadMorePosts}></Waypoint>}
            {isLoading && <Spinner invertColor="true" size="xlarge"/>}
            {/*}
            {success && posts.length !== 0 && (
                <button onClick={loadMorePosts}>Load More Posts</button>
            )}
            */}

        </>
    )
}


export default PostsContainer;
