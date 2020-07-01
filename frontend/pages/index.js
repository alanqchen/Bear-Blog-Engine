import Layout from '../components/PublicLayout/publicLayout';
import PostsContainer from '../components/Posts/postsContainer'
import config from '../config'

const Index = props => (
        
  <Layout> 
      <PostsContainer buildPosts={props.buildPosts}></PostsContainer>        
  </Layout>
        
);

export async function getServerSideProps() {
  // Call API
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
}

export default Index;
  