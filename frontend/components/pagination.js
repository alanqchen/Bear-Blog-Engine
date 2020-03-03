import Link from 'next/link';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import React, { Component } from 'react';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
        };
    }
    render() {
        const { posts } = this.state;
        console.log(this.state.posts);
        return (
            <ul>
                {posts.map(post => (
                <li key={post.id}>
                <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`}>
                <a>{post.title}</a>
                </Link>
                </li>
                ))}
            </ul>
        );
    }
}
export default Pagination;



/*
export default function Blog() {
    return (
        <Paginate></Paginate>
    );
}

/*
class App extends React.Component {
    state = {
        maxID: -1
    }
    static async getInitialProps() {
        const jsonBody = {
            maxID: this.state.maxID.toString()
        }
        const r = await fetch('http://localhost:8080/api/v1/posts/get', {
            method: 'post',
            body: JSON.stringify(jsonBody)
        });
        const reqRes = await res.json();
    
        console.log(`Show data fetched. Count: ${reqRes.pagination.perPage}`);
    
        return {
        posts: reqRes.data.map(post => post)
        };
    }
  
    render() {
        return (
        <Layout>
            {props.posts.map(post => (
                <li key={post.id}>
                <Link href="/[year]/[month]/[slug]" params={{slug: post.slug}} as={`/${post.slug}`}>
                <a>{post.title}</a>
                </Link>
                </li>
            ))}
            <button>Trigger Paginate</button>
        </Layout>
        )
    }

    onAddChild = () => {
        this.setState({
          maxID: this.state.maxID 
        });
    }
}

export default App

  
*/