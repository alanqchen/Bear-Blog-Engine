import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../components/PostLayout/postLayout'
import fetch from 'isomorphic-unfetch'
import dateFormat from 'dateformat'
import Error from 'next/error'

const Index = ({errorCode, props}) => {
  console.log(errorCode);
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return (
    <Layout>
      <Link href="/"><a>Goto Index</a></Link>
      <img src={props.post.data.featureImgUrl}></img>
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
    </Layout>
  );
    
  
};

Index.getInitialProps = async ctx => {

  let res = await fetch(`http://localhost:8080/api/v1/posts${ctx.asPath}`);

  const post = await res.json();

  const errorCode = post.status > 200 ? post.status : false
  
  console.log(errorCode);

  if(errorCode) {
    console.log("bad slug");
    return {errorCode, post: post};
  }
  

  let dateStr = post.data.createdAt;
  dateStr = dateStr.slice(0, dateStr.length-3) + dateStr.slice(dateStr.length-2);
  console.log(dateStr);
  let d = dateFormat(dateStr, 'yyyy-mm-dd HH:MM:ss       Z');

  console.log(d);
  
  let resAuthor = await fetch(`http://localhost:8080/api/v1/users/${post.data.authorid}`);
  const author = await resAuthor.json();

  return {
    errorCode,
    props: {
      post: post,
      month: dateFormat(dateStr, "mmmm"),
      day: dateFormat(dateStr, "dd"),
      year: dateFormat(dateStr, "yyyy"),
      author: author.data.name
    }
  };
};

export default Index;