import Head from "next/head";
import Layout from "../components/PublicLayout/publicLayout";
import PostsContainer from "../components/Posts/postsContainer";
import fetch from "isomorphic-unfetch";
import config from "../config.json";

const Index = ({ initialData }) => {
  return (
    <Layout>
      <Head>
        <meta property="og:url" content={config.blogURL} />
        <meta property="og:title" content={config.blogName} key="title" />
        <meta
          property="og:description"
          content={config.blogDescription}
          key="description"
        />
        <meta
          property="og:image"
          content={
            config.blogURL +
            "/static/icons/android/android-launchericon-192-192.png"
          }
          key="image"
        />
        <meta name="twitter:url" content={config.blogURL} />
        <meta name="twitter:title" content={config.blogName} />
        <meta name="twitter:description" content={config.blogDescription} />
        <meta
          name="twitter:image"
          content={
            config.blogURL +
            "/static/icons/android/android-launchericon-192-192.png"
          }
        />
      </Head>
      <PostsContainer category="" initialData={initialData} />
    </Layout>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1`
  );
  const initialData = await res.json();

  return {
    revalidate: 10,
    props: {
      initialData: initialData,
    },
  };
}

export default Index;
