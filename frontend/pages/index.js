import Link from 'next/link';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'

const Index = props => (
        <Layout>
            {props.posts.map(post => (
                <li key={post.id}>
                <Link href="/[year]/[month]/[slug]" params={{slug: post.slug}} as={`/${post.slug}`}>
                <a>{post.title}</a>
                </Link>
                </li>
            ))}
        </Layout>
);

Index.getInitialProps = async function() {
    const jsonBody = {
        maxID: "-1"
    }
    const res = await fetch('http://localhost:8080/api/v1/posts/get', {
        method: 'post',
        body: JSON.stringify(jsonBody)
    });
    const reqRes = await res.json();
  
    console.log(`Show data fetched. Count: ${reqRes.pagination.perPage}`);
  
    return {
      posts: reqRes.data.map(post => post)
    };
};

export default Index;
