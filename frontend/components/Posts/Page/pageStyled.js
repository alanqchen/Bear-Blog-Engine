import styled from "styled-components";
import LinearProgress from '@material-ui/core/LinearProgress';

const PostCardLinkBase = React.forwardRef((props, ref) => (
    <a ref={ref} {...props}>
        
    </a>
))

export const PostCardLink = styled(PostCardLinkBase)`
    text-decoration: none;
    max-width: 700px;
    width: 95%;
`;

export const LoadingProgress = styled(LinearProgress)`
    position: fixed !important;
    width: 100%;
    top: 0;
`;
    