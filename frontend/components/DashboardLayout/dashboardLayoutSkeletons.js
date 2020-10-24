import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
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
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell>
          <Skeleton variant="text" width="85%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell>
          <Skeleton variant="text" width="92%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell>
          <Skeleton variant="text" width="100%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
      </PostsTableRow>
      <PostsTableRow>
        <TableCell>
          <Skeleton variant="text" width="88%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
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
                <Skeleton variant="text" width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="50%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="55%" />
              </TableCell>
            </TableRow>
          </PostsTableHead>
          <TableBody>
            <TableRowsSkeleton />
          </TableBody>
        </Table>
      </PostsTableContainer>
    </>
  );
};
