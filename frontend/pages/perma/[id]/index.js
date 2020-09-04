import { useEffect } from "react";
import Layout from "../../../components/PostLayout/postLayout";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import Error from "../../404";
import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Head from "next/head";
import config from "../../../config.json";

const Index = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <Typography
          align="left"
          color="textPrimary"
          variant="h1"
          component="h1"
        >
          <Skeleton variant="text" width="80%" />
        </Typography>
        <Typography
          align="left"
          variant="subtitle1"
          color="textPrimary"
          component="h2"
          gutterBottom
        >
          <Skeleton variant="text" width="40%" />
        </Typography>
        <Skeleton variant="rect" width="100%" height={"500px"} />
      </Layout>
    );
  }

  if (!post.success) {
    return <Error />;
  } else {
    useEffect(() => {
      router.replace("/" + post.data.slug);
    }, []);

    return (
      <Layout>
        <Head>
          <meta
            name="twitter:url"
            content={config.blogURL + "/" + post.data.slug}
          />
          <meta name="twitter:title" content={post.data.title} />
          <meta name="twitter:description" content={post.data.subtitle} />
          <meta
            name="twitter:image"
            content={process.env.NEXT_PUBLIC_API_URL + post.data.featureImgUrl}
          />
          <meta
            property="og:url"
            content={config.blogURL + "/" + post.data.slug}
          />
          <meta property="og:title" content={post.data.title} key="title" />
          <meta
            property="og:description"
            content={post.data.subtitle}
            key="description"
          />
          <meta
            property="og:image"
            content={process.env.NEXT_PUBLIC_API_URL + post.data.featureImgUrl}
            key="image"
          />
        </Head>
        <Typography
          align="left"
          color="textPrimary"
          variant="h1"
          component="h1"
        >
          <Skeleton variant="text" width="80%" />
        </Typography>
        <Typography
          align="left"
          variant="subtitle1"
          color="textPrimary"
          component="h2"
          gutterBottom
        >
          <Skeleton variant="text" width="40%" />
        </Typography>
        <Skeleton variant="rect" width="100%" height={"500px"} />
      </Layout>
    );
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "unstable_blocking",
  };
}

export async function getStaticProps(context) {
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${context.params.id}`
  );
  const post = await res.json();

  return {
    revalidate: 3,
    props: {
      post: post,
    },
  };
}

export default Index;
