import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../components/publicLayout'
import fetch from 'isomorphic-unfetch'

const Index = post => (
  
    <div>
      <Link href="/"><a>Goto Index</a></Link>
      <p>{post.data.createdAt}</p>
      <p>Author: {post.data.authorid}</p>
      <h1>{post.data.title}</h1>
      <h4>Tags:</h4>
      <div>
        {post.data.tags.map(tag => (
        <p>{tag}</p>
        ))}
      </div>
      <h4>Body</h4>
      <p>{post.data.body}</p>
      <p>Views: {post.data.views}</p>
    </div>
  
);

Index.getInitialProps = async ctx => {

  let res = await fetch(`http://localhost:8080/api/v1/posts${ctx.asPath}`);
  const post = await res.json();

  if (post.error && res) {
    res.statusCode = 404;
  }

  console.log(`Show data fetched. Count: ${post.data.id}`);

  return post;
};

export default Index;