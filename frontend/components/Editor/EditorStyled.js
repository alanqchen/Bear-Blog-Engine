import styled from "styled-components";
import Editor from 'rich-markdown-editor';
import { Fab, Button, StepLabel } from '@material-ui/core';
import GlobalStyle from '../Theme/theme';
import { Form } from 'formik';

export const StyledEditor = styled(Editor)`
    width: 100%;
    & p {
        font-size: 1rem;
        line-height: 1.7rem;
    }
    & h1 {
        font-size: 2.25rem;
    }
    & h2 {
        font-size: 1.5rem;
    }
    & h3 {
        font-size: 1.25rem;
    }
    & h1, h2, h3, h4, h5, h6 {
        line-height: 1.25;
        margin: 1rem 0px 0.5rem;
    }
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

export const StyledEmbedWrapper = styled.div`
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
`

export const StyledFab = styled(Fab)`
    position: fixed !important;
    bottom: 30px;
    right: 30px;
    background-color: ${GlobalStyle.bluePrimary} !important;
`;

export const EditorButtonGroupWrapper = styled.div`
    width: 97%;
    display: flex;
    justify-content: flex-end;
    margin: auto;
    margin-top: 20px;
    margin-bottom: ${({ noBottomMargin }) => noBottomMargin ? "0px" : "20px"} !important;
`;

export const EditorButton = styled(Button).withConfig({
    shouldForwardProp: prop => true
})`
    background-color: ${({ type }) => type === "danger" ? GlobalStyle.dangerRed : type === "publish" ? GlobalStyle.publishGreen : GlobalStyle.bluePrimary } !important;
    margin-left: 10px !important;
`;

export const EditorButtonOutlined = styled(Button).withConfig({
    shouldForwardProp: prop => !['type'].includes(prop)
})`
    color: ${({ type }) => type === "danger" ? GlobalStyle.dangerRed : type === "publish" ? GlobalStyle.publishGreen : GlobalStyle.bluePrimary } !important;
    margin-left: 10px !important;
    border: 1px solid rgba(203, 36, 49, 0.5) !important;
    &:hover {
        background-color: rgba(203, 36, 49, 0.08) !important;
    }
`

export const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
`;

export const LocalFeatureImageWrapper = styled.div`
    position: relative;
    margin-top: 20px;
`;

export const StyledImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    max-height: 300px;
`;

export const StyledImage = styled.img`
    display: block;
    flex-shrink: 0;
    width: 100%;
    height: auto;
`;

export const ImageInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
