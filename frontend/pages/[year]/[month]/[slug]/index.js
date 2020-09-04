import { useState } from "react";
import Layout from "../../../../components/PostLayout/postLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import Error from "../../../404";
import ReadOnlyEditor from "../../../../components/Editor/ReadOnlyEditor";
import {
  Typography,
  Box,
  Divider,
  Link,
  Button,
  Tooltip,
} from "@material-ui/core";
import { Link as LinkIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import FeatureImage from "../../../../components/Posts/Page/PostCard/featureImage";
import { timestamp2date } from "../../../../components/utils/helpers";
import { DateShareWrapper } from "../../../../components/PostLayout/postLayoutSyled";
import config from "../../../../config.json";

const Index = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
        <Skeleton variant="rect" width="100%" height={"600px"} />
      </Layout>
    );
  }

  if (props.errorCode) {
    return <Error />;
  }

  return (
    <Layout>
      <Head>
        <meta
          name="twitter:url"
          content={config.blogURL + "/" + props.post.data.slug}
        />
        <meta name="twitter:title" content={props.post.data.title} />
        <meta name="twitter:description" content={props.post.data.subtitle} />
        <meta
          name="twitter:image"
          content={
            process.env.NEXT_PUBLIC_API_URL + props.post.data.featureImgUrl
          }
        />
        <meta
          property="og:url"
          content={config.blogURL + "/" + props.post.data.slug}
        />
        <meta property="og:title" content={props.post.data.title} key="title" />
        <meta
          property="og:description"
          content={props.post.data.subtitle}
          key="description"
        />
        <meta
          property="og:image"
          content={
            process.env.NEXT_PUBLIC_API_URL + props.post.data.featureImgUrl
          }
          key="image"
        />
      </Head>
      <Typography align="left" color="textPrimary" variant="h1" component="h1">
        <Box fontWeight={500} fontSize={"2.5rem"}>
          {props.post.data.title}
        </Box>
      </Typography>
      <Box m={1} />
      <Typography
        align="left"
        variant="subtitle1"
        color="textPrimary"
        component="h2"
        gutterBottom={false}
      >
        <Box fontSize={18}>{props.post.data.subtitle}</Box>
      </Typography>
      <DateShareWrapper>
        <Typography
          align="left"
          variant="subtitle2"
          color="textSecondary"
          gutterBottom={false}
        >
          {props.dateF}
          {props.updateF && " (updated " + props.updateF + ")"}
        </Typography>
        <div>
          <Tooltip
            title="Copied permalink to clipboard!"
            open={tooltipOpen}
            arrow
            placement="top"
            onClose={() => {
              setTooltipOpen(false);
            }}
            leaveDelay={1000}
          >
            <Button
              size="small"
              onClick={async () => {
                await navigator.clipboard
                  .writeText(config.blogURL + "/perma/" + props.post.data.id)
                  .then(() => {
                    setTooltipOpen(true);
                  });
              }}
            >
              <LinkIcon />
            </Button>
          </Tooltip>
        </div>
      </DateShareWrapper>
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
      <Box m={4} />
      <Typography align="center" color="textSecondary" gutterBottom>
        Powered by{" "}
        <Link
          href="https://github.com/alanqchen/Bear-Blog-Engine"
          color="textSecondary"
        >
          Bear Blog Engine
        </Link>
      </Typography>
      <Box m={3} />
    </Layout>
  );
};

export async function getStaticPaths() {
  let linkPaths = [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1`
  );
  const posts = await res.json();

  posts.data.map((post) => {
    linkPaths = [
      ...linkPaths,
      {
        params: {
          year: post.slug.substring(0, 4),
          month: post.slug.substring(5, 7),
          slug: post.slug.substring(8),
        },
      },
    ];
  });

  return {
    paths: linkPaths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${context.params.year}/${context.params.month}/${context.params.slug}`
  );
  const post = await res.json();
  const errorCode = post.status > 200 ? post.status : false;

  if (errorCode) {
    return {
      props: {
        errorCode: errorCode,
        post: post,
      },
    };
  }

  const dateStr = timestamp2date(post.data.createdAt);

  let updateStr = post.data.updatedAt;
  if (updateStr) {
    updateStr = timestamp2date(updateStr);
  }

  const authorName = post.data.authorid;

  return {
    revalidate: 10,
    props: {
      errorCode: errorCode,
      post: post,
      dateF: dateStr,
      updateF: updateStr,
      author: authorName,
    },
  };
}

export default Index;
