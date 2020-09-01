import styled from "styled-components";
import GlobalTheme from "../Theme/theme";
import { Button } from "@material-ui/core";

export const WaveButton = styled(Button).withConfig({
  shouldForwardProp: () => true,
})`
  background-color: rgba(0, 0, 0, 0) !important;
  transform: translate3d(0px, 0px, 0px);
  border: 2px solid ${GlobalTheme.scarlet} !important;
  border-radius: 0px !important;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  min-width: 130px !important;

  &:hover {
    cursor: pointer;
  }

  &:hover .MuiTouchRipple-root {
    transform-origin: bottom center;
    transform: scale3d(1, 1, 1);
  }

  &:hover .MuiButton-label {
    color: ${GlobalTheme.textPrimary};
  }

  & .MuiButton-label {
    z-index: 1;
    color: ${GlobalTheme.scarlet};
    transition: color 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  & .MuiTouchRipple-root {
    border-radius: initial !important;
    width: 100%;
    height: 100%;
    background-color: ${GlobalTheme.scarlet};
    transform-origin: top center;
    transform: scale3d(1, 0, 1);
    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &.Mui-disabled {
    border: 2px solid ${GlobalTheme.backgroundAlt2} !important;
  }

  &.Mui-disabled .MuiButton-label {
    color: ${GlobalTheme.backgroundAlt2} !important;
  }
`;

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
`;
