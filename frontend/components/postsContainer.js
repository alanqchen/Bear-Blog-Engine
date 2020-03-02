import Link from 'next/link';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'
import dynamic from 'next/dynamic'
import React, { Component, Children } from 'react';
import pagination from '../components/pagination'

class PostsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            currPosts: [],
            currMaxId: "-1",
            numChildren: 1
        };

    }

    createPage() {
        const jsonBody = {
            maxID: this.state.currMaxId
        }
        fetch('http://localhost:8080/api/v1/posts/get', {
            method: 'post',
            body: JSON.stringify(jsonBody)
        })
        .then(response => response.json())
        .then(data => this.state({
            currPosts: data.data, 
            currMaxId: data.pagination.minID.toString(),
            children: [
                ...children,
                <pagination posts={this.state.currPosts}/>
            ]
        }));
        console.log(this.props.children);
    }
    

    render() {
        const children = [];
        const posts = [];
        const maxID = "-1";
        let postsData;
        /*
        for (var i = 0; i < this.state.numChildren; i += 1) {
            const jsonBody = {
                maxID: maxID
            }
            fetch('http://localhost:8080/api/v1/posts/get', {
                method: 'post',
                body: JSON.stringify(jsonBody)
            })
            .then(response => response.json())
            .then(data => {
                posts = data.data;
                maxID = data.pagination.minID.toString;
            });
          

            children.push(<pagination key={i} posts={posts}/>);
        };
        */

        return (
        <PostsContainer addChild={this.onAddPost}>
            {children}
        </PostsContainer>
        );

    }
}


export default PostsContainer;
