import Layout from '../components/PublicLayout/publicLayout';
import PostsContainer from '../components/Posts/postsContainer';
import fetch from 'isomorphic-unfetch';
import {wrapper, State} from '../redux/store';
import { fetchPosts as fetchPostsAction } from '../redux/fetchPosts/actions';

const Index = ({initialData, time}) => {
    const timeString = new Date(time).toLocaleTimeString();
    return (
        <Layout> 
            <p>{timeString}</p>
            <PostsContainer category="" initialData={initialData}/>
        </Layout>
    );
};

export async function getStaticProps({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1`);
    const initialData = await res.json();

    return {
      // Set the timeout for generating to 1 second
      // This timeout could be longer depending on how often data changes
      revalidate: 10,
      props: {
        initialData: initialData,
        time: Date.now()
      },
    };
}

export default Index;
