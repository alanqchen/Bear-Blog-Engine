import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";
import Layout from "../../../components/PublicLayout/publicLayout";
import { HeaderWrapper } from "../../../components/PublicLayout/publicLayoutStyled";
import PostsContainer from "../../../components/Posts/postsContainer";
import config from "../../../config.json";

const Index = ({ initialData }) => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <Layout>
      <HeaderWrapper>
        <Typography
          align="center"
          fontWeight="fontWeightLight"
          variant="h3"
          color="textPrimary"
          component="h4"
        >
          Category: {category}
        </Typography>
      </HeaderWrapper>
      <PostsContainer category={category} initialData={initialData} />
    </Layout>
  );
};

export function getStaticPaths() {
  let linkPaths = [];
  config.navlinks.map((category) => {
    if (category.isCategory) {
      linkPaths = [
        ...linkPaths,
        { params: { category: category.link.substring(10) } },
      ];
    }
    return linkPaths;
  });

  return {
    paths: linkPaths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get?maxID=-1&tags=${params.category}`
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
