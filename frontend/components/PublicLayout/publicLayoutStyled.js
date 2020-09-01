import styled from "styled-components";
import SearchBase from "material-ui-search-bar";
import { Paper } from "@material-ui/core";
import GlobalTheme from "../Theme/theme";

export const CenteredContainer = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export const StyledCenteredContainer = styled(CenteredContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderWrapper = styled.div`
  margin-bottom: 10px;
`;

export const WidthWrapper = styled.div`
  max-width: 700px;
  width: 95%;
`;

export const StyledSearchBase = styled(SearchBase)`
  border-radius: 1em !important;
  background-color: ${GlobalTheme.backgroundAlt1} !important;
  box-shadow: none !important;
`;

export const StyledSearchPaper = styled(Paper)`
  border-radius: 1em !important;
  overflow: hidden;
  margin-bottom: 15px;
  background-color: ${GlobalTheme.backgroundAlt1} !important;
  transition: max-height 0.5s linear;
`;

export const SearchItemWrapper = styled.div`
  padding: 10px 16px 10px 16px;

  &:hover {
    background-color: ${GlobalTheme.backgroundAlt2} !important;
    cursor: pointer;
  }
`;
