import { useEffect } from 'react'
import {Provider, connect} from 'react-redux';
import { wrapper, State } from '../redux/store';
import Layout from '../components/PublicLayout/publicLayout';
import PostsContainer from '../components/Posts/postsContainer'
import config from '../config'
import { fetchPosts } from '../redux/fetchPosts/actions'

const Index = ({posts}) => (
        
  <Layout> 
      {posts}
      {/*<PostsContainer buildPosts={props.buildPosts}></PostsContainer>*/}
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
        await store.dispatch(fetchPosts());
        console.log("DONE");
    }
);

export default connect(state => state)(Index);
  