import { useRouter } from 'next/router';
import { fetchCategoryNew } from '../../../redux/fetchCategory/actions';
import { wrapper } from '../../../redux/store';
import { Typography } from '@material-ui/core';
import Layout from '../../../components/PublicLayout/publicLayout';
import { HeaderWrapper } from '../../../components/PublicLayout/publicLayoutStyled';
import PostsContainer from '../../../components/Posts/postsContainer';

const Index = () => {
    const router = useRouter();
    const { category } = router.query;
    return (
        <Layout> 
            <HeaderWrapper>
                <Typography align="center" fontWeight="fontWeightLight" variant="h3" color="textPrimary" component="h4">
                    Category: {category}
                </Typography>
            </HeaderWrapper>
            <PostsContainer category={category}/>
        </Layout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    ({store, req, res, params, ...etc}) => {
        store.dispatch(fetchCategoryNew(params.category));
    }
);

export default Index;
