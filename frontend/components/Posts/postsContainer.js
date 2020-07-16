import {connect} from 'react-redux';
import { fetchPosts as fetchPostsAction } from '../../redux/fetchPosts/actions';
import { fetchCategory as fetchCategoryAction } from '../../redux/fetchCategory/actions';
import Page from '../Posts/Page/page'
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

function PostsContainer({fetchPosts, dispatch, category }) {

    const loadMorePosts = async() => {
        if(category === "") {
            await dispatch(fetchPostsAction());
        } else {
            await dispatch(fetchCategoryAction(category));
        }
    };

    return (
        <>
            <Page posts={fetchPosts.posts}/>

            {!fetchPosts.loading && fetchPosts.error === null && fetchPosts.hasMore
                && <Waypoint onEnter={() => loadMorePosts()} ></Waypoint>
            }
            {fetchPosts.error === null && fetchPosts.posts.length === 0 ? 
                <>
                    <PostCard post={null} skeleton={true} />
                    <PostCard post={null} skeleton={true} />
                </>
            : fetchPosts.loading &&
                <PostCard post={null} skeleton={true} />
            }
            {!fetchPosts.hasMore &&
                <Typography align="center" fontWeight="fontWeightLight" variant="subtitle1" color="textSecondary" component="h1">
                    No more posts to show!
                </Typography>
            }
            {!fetchPosts.loading && fetchPosts.error !== null && fetchPosts.hasMore && 
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
        }
    }
}

export default connect(mapStateToProps)(PostsContainer);
