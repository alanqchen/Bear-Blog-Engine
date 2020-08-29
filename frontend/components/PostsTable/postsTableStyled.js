import styled from "styled-components";
import { 
    Chip,
    TableRow,
    TableContainer,
    TableHead
} from '@material-ui/core';

export const StatusChip = styled(Chip).withConfig({
    shouldForwardProp: prop => !['published'].includes(prop)
})`
    border-radius: 3px !important;
    background-color: ${({ published }) => published ? "rgba(75, 225, 0, 0.1)" : "rgba(211, 116, 228, 0.1)" } !important;
    color: ${({ published }) => published ? "rgb(75, 225, 0)" : "rgb(211, 116, 228)" } !important;
    text-transform: uppercase;
`;

export const PostsTableRow = styled(TableRow)`
    &:hover {
        cursor: pointer;
    }
    & td {
        color: #dbdde0 !important;
    }
`;

export const PostsTableContainer = styled(TableContainer)`
    width: 97% !important;
`;

export const PostsTableHead = styled(TableHead)`
    background-color: #25292f !important;
    & tr th {
        color: #a7aebb !important;
    }
`;
