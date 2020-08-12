import {connect} from 'react-redux';
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

function PostsList() {
    return (
        <>
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
                        <PostsTableRow hover>
                            <TableCell>This is a test title (A little longer) Blah Blah Blah Lorem Ipsum</TableCell>
                            <TableCell><StatusChip label="Published" published /></TableCell>
                            <TableCell>Some Date Here</TableCell>
                            <TableCell>Some Name Here</TableCell>
                        </PostsTableRow>
                        <PostsTableRow hover>
                            <TableCell>This is a test title (A little longer)</TableCell>
                            <TableCell><StatusChip label="Draft" /></TableCell>
                            <TableCell>Some Date Here</TableCell>
                            <TableCell>Some Name Here</TableCell>
                        </PostsTableRow>
                    </TableBody>
                </Table>
            </PostsTableContainer>
        </>
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
    }
}

export default connect(mapStateToProps)(PostsList);
