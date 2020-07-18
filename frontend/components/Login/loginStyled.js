import styled from "styled-components";
import { Paper, TextField } from '@material-ui/core';
import GlobalTheme from '../Theme/theme';

export const StyledLoginPaper = styled(Paper)`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    width: 90%;
    background-color: ${GlobalTheme.backgroundAlt1} !important;
    max-height: 400px;
    height: 50vh;
`;

export const LoginPaperWrapper = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
    width: 100vw;
`;

export const StyledTextField = styled(TextField)`
    width: 80%;
    margin-top: 15px !important;
    margin-bottom: 15px !important;

    & label {
        color: ${GlobalTheme.textPrimary} !important;
    }

    & label.Mui-focused {
        color: ${GlobalTheme.focused} !important;
    }

    & .Mui-focused fieldset {
        border-color: ${GlobalTheme.focused} !important;
    }

    & .MuiInputBase-root {
        background-color: rgba(0, 0, 0, 0.15);
    }
`;

export const InnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
