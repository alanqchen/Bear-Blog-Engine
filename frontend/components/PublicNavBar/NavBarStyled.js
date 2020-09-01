import styled from "styled-components";
import NavBar from "./NavBar";

export const StyledNavBar = styled(NavBar)`
  transition: background-color 225ms linear,
    transform 225ms cubic-bezier(0, 0, 0.2, 1) !important;
  ${({ atTop }) =>
    atTop &&
    `
        box-shadow: 0px 0px !important;
    `}
`;
