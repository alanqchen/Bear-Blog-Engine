import styled, { keyframes } from "styled-components";
import { Typography, Link } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import GlobalStyle from "../Theme/theme";
import config from "../../config.json";

export const CategoriesWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

export const Category = styled(Typography)`
  margin-left: 16px;
`;

export const HeaderLink = styled.a`
  text-decoration: none;
  color: ${GlobalStyle.textPrimary};

  &:hover {
    cursor: pointer;
    text-decoration: none !important;
  }
`;

export const MUILink = styled(Link)`
  text-decoration: none;
  color: ${GlobalStyle.textPrimary};

  &:hover {
    cursor: pointer;
    text-decoration: none !important;
  }
`;

export const SearchIconStyled = styled(SearchIcon)`
  font-size: 26px;
  color: ${GlobalStyle.textPrimary};
`;

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
        visibility: visible;
    }
`;

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        visibility: hidden;
    }
`;

export const SideMenuClose = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.5);
  animation: 0.2s ${({ isOpen }) => (isOpen ? fadeIn : fadeOut)};
  animation-timing-function: cubic-bezier(0.25, 1, 0.25, 1);
  animation-fill-mode: forwards;
  ${({ isOpen }) =>
    isOpen &&
    `
    & li {
        transition-delay: 0s;
        opacity: 1;
        transform: translate3d(0, 0px, 0);
    }
    `}
`;

export const SideMenuWrapper = styled.div`
  background-color: black;
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
  z-index: 12;
  ${({ isOpen }) =>
    isOpen
      ? `
        @media (max-width: 700px) {
            width: 250px;
        }
        @media (min-width: 700px) {
            width: 300px;
        }`
      : `
        width: 0px;
    `}
  transition: width 0.4s cubic-bezier(0.25, 1, 0.25, 1);
`;

export const SideMenuNavigation = styled.div`
  position: absolute;
  top: 75px;
  right: 50px;
  @media (max-width: 700px) {
    width: 150px;
  }
  @media (min-width: 700px) {
    width: 200px;
  }
`;

export const SideMenuNavLinks = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;

  & li {
    display: block;
    margin: 0;
    text-align: right;
    transition: transform 0.4s 0.1s cubic-bezier(0.25, 1, 0.25, 1),
      opacity 0.4s cubic-bezier(0.25, 1, 0.25, 1);
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }

  & li a {
    display: block;
    text-decoration: none;
    color: ${GlobalStyle.textPrimary};
    width: 100%;
    border-bottom: 1pt solid #404040;
    transition: color 130ms linear;
  }

  & li a:hover {
    cursor: pointer;
    text-decoration: none !important;
    color: ${GlobalStyle.textSecondary};
  }
`;

export const SideMenuNavLinkItem = styled.li`
  ${({ isOpen }) =>
    isOpen &&
    `
    & {
        opacity: 1 !important;
        transform: translate3d(0, 0px, 0) !important;
    }
    `}

  ${({ primary = false }) =>
    primary &&
    `
    @media (max-width: ${config.navMinWidth}) {
        display: inherit !important;
    }
    @media (min-width: ${config.navMinWidth}) {
        display: none !important;
    }`}
`;

export const NavLinks = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;

  @media (max-width: ${config.navMinWidth}) {
    display: none !important;
  }

  & li {
    margin-left: 16px;
  }

  & li a {
    position: relative;
    display: block;
    text-decoration: none;
    color: ${GlobalStyle.textPrimary};
    line-height: 1.4;
    transition: opacity 0.6s linear;
    font-weight: 300 !important;
  }

  & li a::after {
    content: "";
    transform-origin: right;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${GlobalStyle.textPrimary};
    transform: scaleX(0);
    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  }

  & li:hover a::after {
    transform-origin: left;
    transform: scaleX(1);
  }

  & li a:hover {
    text-decoration: none !important;
  }
`;

export const NavLink = styled.li`
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`;

export const SearchIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 48px;
  margin-right: 8px;

  &:hover {
    cursor: pointer;
  }
`;
