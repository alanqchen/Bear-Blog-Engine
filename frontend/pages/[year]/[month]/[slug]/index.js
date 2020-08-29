import Layout from '../../../../components/PostLayout/postLayout';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import Error from 'next/error';
import ReadOnlyEditor from '../../../../components/Editor/ReadOnlyEditor';
import { Typography, CircularProgress, Box, Divider } from '@material-ui/core';
import FeatureImage from '../../../../components/Posts/Page/PostCard/featureImage';
import {timestamp2date} from '../../../../components/utils/helpers'

const Index = props => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <Layout>
                <CircularProgress />
            </Layout>
        );
    }

    if (props.errorCode) {
        return <Error statusCode={props.errorCode} />
    }

    return (
        <Layout>
            <Typography align="left" color="textPrimary" variant="h2" component="h1">
                <Box fontWeight={550} fontSize={32}>
                    {props.post.data.title}
                </Box>
            </Typography>
            <Box m={1} />
            <Typography align="left" variant="subtitle1" color="textPrimary" component="h2" gutterBottom>
                <Box fontSize={18}>
                    {props.post.data.subtitle}
                </Box>
            </Typography>
            <Typography align="left" variant="subtitle2" color="textSecondary" gutterBottom>
                {props.dateF}
                {props.updateF && " (updated " + props.updateF + ")"}
            </Typography>
            <FeatureImage 
                featureImgUrl={props.post.data.featureImgUrl}
                tags={props.post.data.tags}
                skeleton={false}
                moreHeight
                noMargin
            />
            <Box m={2} />
            <Divider />
            <Box m={1} />
            <ReadOnlyEditor defaultValue={props.post.data.body} />
            

        </Layout>
    );
};

export async function getStaticPaths() {
    let linkPaths = [];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1`);
    const posts = await res.json();

    posts.data.map((post, i) => {
        linkPaths = [
            ...linkPaths, 
            { 
                params: { 
                    year: post.slug.substring(0,4),
                    month: post.slug.substring(5,7),
                    slug: post.slug.substring(8)
                } 
            }
        ];
    });

    return {
        paths: linkPaths,
        fallback: true
    };
}

export async function getStaticProps(context) {

    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${context.params.year}/${context.params.month}/${context.params.slug}`);
    const post = await res.json();
    const errorCode = post.status > 200 ? post.status : false;

    if(errorCode) {
        return {
            props: {
                errorCode: errorCode,
                post: post
            }
        };
    }

    const dateStr = timestamp2date(post.data.createdAt)

    let updateStr = post.data.updatedAt;
    if(updateStr) {
        updateStr = timestamp2date(updateStr);
    }

    const authorName = post.data.authorid;

    return {
        props: {
            errorCode: errorCode,
            post: post,
            dateF: dateStr,
            updateF: updateStr,
            author: authorName
        }
    };
};

export default Index;
