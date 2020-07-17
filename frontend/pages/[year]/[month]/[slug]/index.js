import Link from 'next/link';
import Layout from '../../../../components/PostLayout/postLayout'
import fetch from 'isomorphic-unfetch'
import Error from 'next/error'
import {timestamp2date} from '../../../../components/utils/helpers'
import config from '../../../../config'

const Index = props => {
    if (props.errorCode) {
        return <Error statusCode={props.errorCode} />
    }
    return (
        <Layout>
            <Link href="/"><a>Goto Index</a></Link>
            <img src={config.apiURL + props.post.data.featureImgUrl}></img>
            <p>{props.post.data.createdAt}</p>
            <p>{props.dateF}</p>
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

export async function getServerSideProps(context) {

    let res = await fetch(`${config.apiURL}/api/v1/posts/${context.params.year}/${context.params.month}/${context.params.slug}`);
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

    let dateStr = post.data.createdAt;
    dateStr = timestamp2date(dateStr)

    let resAuthor = await fetch(`${config.apiURL}/api/v1/users/${post.data.authorid}`);
    const author = await resAuthor.json();
    let authorName;
    if(!author.success) {
        authorName = "Unknown User";
    } else {
        authorName = author.data.name;
    }

    return {
        props: {
            errorCode: errorCode,
            post: post,
            dateF: dateStr,
            author: authorName
        }
    };
};

export default Index;
