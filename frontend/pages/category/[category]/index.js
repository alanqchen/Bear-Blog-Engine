import { useRouter } from 'next/router';
import Layout from '../../../components/PublicLayout/publicLayout';
import PostsContainer from '../../../components/Posts/postsContainer';

const Index = () => {
    const router = useRouter();
    const { category } = router.query;
    return (
        <Layout> 
            <h1>Category: {category}</h1>
            <PostsContainer category={category}/>
        </Layout>
    );
};

export default Index;
