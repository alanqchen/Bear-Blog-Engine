import styled from "styled-components";
import { Paper, TextField } from '@material-ui/core';

export const StyledLoginPaper = styled(Paper)`
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 500px;
    width: 90%;
    min-height: 40vh;
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
`;
