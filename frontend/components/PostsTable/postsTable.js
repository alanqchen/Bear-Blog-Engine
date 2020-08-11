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
    PostsTableContainer
} from './postsTableStyled';

function PostsList() {
    return (
        <>
            <PostsTableContainer component={Paper}>
                <Table aria-label="posts table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Author</TableCell>
                        </TableRow>
                    </TableHead>
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

export default PostsList;
