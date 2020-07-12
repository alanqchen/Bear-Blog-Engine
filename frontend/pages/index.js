import { useEffect } from 'react'
import {Provider, connect} from 'react-redux';
import { wrapper, State } from '../redux/store';
import Layout from '../components/PublicLayout/publicLayout';
import PostsContainer from '../components/Posts/postsContainer'
import config from '../config'
import { Waypoint } from 'react-waypoint';
import { fetchPosts } from '../redux/fetchPosts/actions'



const Index = props => (
  <Layout> 
      {console.log("Given")}
      {console.log(props)}
      <PostsContainer buildState={props}></PostsContainer>
  </Layout>
        
);

//export async function getServerSideProps() {
    // Call API
    /*
    const jsonBody = {
        maxID: "-1"
    }
    const res = await fetch(config.apiURL+'/api/v1/posts/get', {
        method: 'post',
        body: JSON.stringify(jsonBody)
    })
    const posts = await res.json()

    return {
        props: {
            buildPosts: posts
        }
    }
    */
   
//}

export const getServerSideProps = wrapper.getServerSideProps(
async({store, req, res, ...etc}) => {
        console.log("START FETCH DISPATCH");
        console.log("STATE BEFORE DISPATCH");
        console.log(store.getState());
        if(store.getState().fetchPosts.posts === []) {
            await store.dispatch(fetchPosts());
        } else {
            console.log("SKIPPED DISPATCH")
        }
        console.log("DONE");
        console.log(store.getState());
        const fetchPostsState = store.getState().fetchPosts;
        return {
            props: {
                buildPosts: fetchPostsState.posts,
                minID: fetchPostsState.minID,
                hasMore: fetchPostsState.hasMore,
                success: fetchPostsState.error === null
            }
        }
    }
);

const mapStateToProps = (state, ownProps) => {
    console.log("MAPSTATETOPROPS")
    console.log(state)
    return {
        fetchPosts: {
            posts: state.fetchPosts.posts,
            hasMore: state.fetchPosts.hasMore
        }
    }
}

export default connect(mapStateToProps)(Index);
  