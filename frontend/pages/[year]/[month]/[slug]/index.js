import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../components/publicLayout'
import fetch from 'isomorphic-unfetch'
import dateFormat from 'dateformat'

const Index = props => (
  
    <div>
      <Link href="/"><a>Goto Index</a></Link>
      <p>{props.post.data.createdAt}</p>
      <p>{props.month} {props.day}, {props.year}</p>
      <p>Author: {props.author}</p>
      
      <h1>{props.post.data.title}</h1>
      <h3>{props.post.data.subtitle}</h3>
      <h4>Tags:</h4>
      <div>
        {props.post.data.tags.map(tag => (
        <p key={tag}>{tag}</p>
        ))}
      </div>
      <h4>Body</h4>
      <p>{props.post.data.body}</p>
      <p>Views: {props.post.data.views}</p>
    </div>
  
);

Index.getInitialProps = async ctx => {

  let res = await fetch(`http://localhost:8080/api/v1/posts${ctx.asPath}`);
  const post = await res.json();

  if (!post.status && res) {
    res.statusCode = 404;
  }

  console.log(`Show data fetched. Count: ${post.data.id}`);
  let dateStr = post.data.createdAt;
  dateStr = dateStr.slice(0, dateStr.length-3) + dateStr.slice(dateStr.length-2);
  console.log(dateStr);
  let d = dateFormat(dateStr, 'yyyy-mm-dd HH:MM:ss       Z');

  console.log(d);
  
  let resAuthor = await fetch(`http://localhost:8080/api/v1/users/${post.data.authorid}`);
  const author = await resAuthor.json();

  return {
    post: post,
    month: dateFormat(dateStr, "mmmm"),
    day: dateFormat(dateStr, "dd"),
    year: dateFormat(dateStr, "yyyy"),
    author: author.data.name
  };
};

export default Index;