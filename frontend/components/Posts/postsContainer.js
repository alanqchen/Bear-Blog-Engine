import {connect} from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchPosts as fetchPostsAction } from '../../redux/fetchPosts/actions';
import { fetchCategory as fetchCategoryAction } from '../../redux/fetchCategory/actions';
import { fetchCategoryNew } from '../../redux/fetchCategory/actions';
import Page from '../Posts/Page/page';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components'
import PostCard from './Page/PostCard/postCard';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import { Typography } from '@material-ui/core';
import { WaveButton } from '../Theme/StyledComponents'

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

function PostsContainer({fetchPosts, fetchCategory, dispatch, category }) {

    let fetchType = category === "" ? fetchPosts : fetchCategory;
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loadMorePosts = async() => {
        setIsInitialLoad(false)
        if(category === "") {
            await dispatch(fetchPostsAction());
        } else {
            await dispatch(fetchCategoryAction(category));
        }
    };

    return (
        <>

            <Page posts={fetchType.posts}/>

            {!fetchType.loading && fetchType.error === null && fetchType.hasMore
                && <Waypoint onEnter={() => loadMorePosts()} ></Waypoint>
            }
            {fetchType.error === null && fetchType.posts.length === 0 && (fetchType.loading || isInitialLoad) ? 
                <>
                    <PostCard post={null} skeleton={true} />
                    <PostCard post={null} skeleton={true} />
                </>
            : fetchType.loading &&
                <PostCard post={null} skeleton={true} />
            }
            {!fetchType.hasMore &&
                <Typography align="center" fontWeight="fontWeightLight" variant="subtitle1" color="textSecondary" component="h1">
                    No more posts to show!
                </Typography>
            }
            {!fetchType.loading && fetchType.error !== null && fetchType.hasMore && 
                <>
                    <CloudOffIcon fontSize="large" />
                    <Typography align="center" fontWeight="fontWeightLight" variant="h6" color="textPrimary" component="h6">
                        Oops! Something went wrong. Check your internet connection and try again.
                    </Typography>
                    <WaveButton variant="contained" color="primary" onClick={() => {loadMorePosts()}}>
                        Try Again
                    </WaveButton>
                </>
            }
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        fetchPosts: {
            posts: state.fetchPosts.posts,
            loading: state.fetchPosts.loading,
            minID: state.fetchPosts.minID,
            hasMore: state.fetchPosts.hasMore,
            error: state.fetchPosts.error
        },
        fetchCategory: {
            posts: state.fetchCategory.posts,
            loading: state.fetchCategory.loading,
            minID: state.fetchCategory.minID,
            hasMore: state.fetchCategory.hasMore,
            error: state.fetchCategory.error,
            category: state.fetchCategory.category
        }
    }
}

export default connect(mapStateToProps)(PostsContainer);
