import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  PostsTableRow,
  PostsTableContainer,
  PostsTableHead,
} from "../PostsTable/postsTableStyled";
import { ContentSpacer } from "./dashboardLayoutStyled";

export const TableRowsSkeleton = () => {
  return (
    <>
      <PostsTableRow>
        <TableCell></TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell></TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell></TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell></TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell></TableCell>
      </PostsTableRow>
    </>
  );
};

export const TableSkeleton = () => {
  return (
    <>
      <ContentSpacer />
      <PostsTableContainer component={Paper}>
        <Table aria-label="posts table">
          <PostsTableHead>
            <TableRow>
              <TableCell>
                <span style={{ visibility: "hidden" }}>.</span>
              </TableCell>
            </TableRow>
          </PostsTableHead>
          <TableBody></TableBody>
        </Table>
      </PostsTableContainer>
    </>
  );
};

export const PostEditSkeleton = () => {
  return (
    <>
      <ContentSpacer />
      <Skeleton width="80%">
        <Typography>.</Typography>
      </Skeleton>
      <Skeleton width="100%">
        <Typography>.</Typography>
      </Skeleton>
      <Skeleton width="90%">
        <Typography>.</Typography>
      </Skeleton>
      <Box m="46px" />
      <Skeleton variant="rect" width="100%" height="300px">
        <Typography>.</Typography>
      </Skeleton>
      <Box m="46px" />
      <Skeleton variant="text" width="100%" />
    </>
  );
};
