import React from "react";
import styled, { keyframes } from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";

// eslint-disable-next-line react/display-name
const PostCardLinkBase = React.forwardRef((props, ref) => (
  <a ref={ref} {...props}></a>
));

export const PostCardLink = styled(PostCardLinkBase)`
  text-decoration: none;
  max-width: 700px;
  width: 95%;
`;

const fadeIn = keyframes`
    0% { opacity:0; }
    50% { opacity:0; }
    100% { opacity:1; }
`;

export const LoadingProgress = styled(LinearProgress)`
  animation: 2s ease 0s normal forwards 1 ${fadeIn};
  z-index: 9999;
  position: fixed !important;
  width: 100%;
  top: 0;
`;
