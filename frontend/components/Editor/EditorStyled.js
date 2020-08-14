import styled from "styled-components";
import Editor from 'rich-markdown-editor';
import { StepLabel } from "@material-ui/core";

export const StyledEditor = styled(Editor)`
    width: 100%;
`;

export const StyledYoutubeEmbed = styled.iframe`
    border-style: none;
    width: 100%;
    height: 400px;
`;

export const StyledYoutubeEmbedWrapper = styled.div`
    width: 100%;
    height: 400px;
    border-radius: 3px;
    overflow: hidden;
`;
