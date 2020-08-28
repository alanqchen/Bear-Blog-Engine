import {connect} from 'react-redux';
import { useEffect, useState } from 'react';
import {
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import {
    StatusChip,
    PostsTableRow,
    PostsTableContainer,
    PostsTableHead
} from './postsTableStyled';
import { Waypoint } from 'react-waypoint';
import { fetchPosts } from '../../redux/fetchDashboardPosts/action';
import { timestamp2date } from '../utils/helpers';
import Router from 'next/router';

function PostsList({ fetchDashboardPosts, auth, dispatch }) {

    const [loaded, setLoaded] = useState(false);

    useEffect(()=> {
        if(fetchDashboardPosts.error) {
            Router.push("/auth/portal/login");
        }
        setLoaded(true);
    }, [fetchDashboardPosts.error])

    return (
        <PostsTableContainer component={Paper}>
            <Table aria-label="posts table">
                <PostsTableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Author</TableCell>
                    </TableRow>
                </PostsTableHead>
                <TableBody>
                    {fetchDashboardPosts.posts.map((post, i) => (
                        <PostsTableRow hover onClick={()=>{Router.push("/auth/portal/dashboard/post/" + post.slug)}} key={i}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.hidden ? <StatusChip label="Draft" /> : <StatusChip label="Published" published /> }</TableCell>
                            <TableCell>{post.updatedAt ? timestamp2date(post.updatedAt) : timestamp2date(post.createdAt)}</TableCell>
                            <TableCell>{post.authorid}</TableCell>
                        </PostsTableRow>
                    ))}
                </TableBody>
            </Table>
            {loaded && !auth.loading && fetchDashboardPosts.hasMore && <Waypoint onEnter={() => {dispatch(fetchPosts())}} />}
        </PostsTableContainer>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        fetchDashboardPosts: {
            posts: state.fetchDashboardPosts.posts,
            publishedPosts: state.fetchDashboardPosts.publishedPosts,
            draftPosts: state.fetchDashboardPosts.draftPosts,
            loading: state.fetchDashboardPosts.loading,
            minID: state.fetchDashboardPosts.minID,
            hasMore: state.fetchDashboardPosts.hasMore,
            error: state.fetchDashboardPosts.error
        },
        auth: {
            loading: state.auth.loading
        }
    }
}

export default connect(mapStateToProps)(PostsList);
