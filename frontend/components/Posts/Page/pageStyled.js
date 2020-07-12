import styled from "styled-components";

const PostCardLinkBase = React.forwardRef((props, ref) => (
    <a ref={ref} {...props}>
        
    </a>
))

export const PostCardLink = styled(PostCardLinkBase)`
    text-decoration: none;
    max-width: 800px;
    width: 97%;
`;
    