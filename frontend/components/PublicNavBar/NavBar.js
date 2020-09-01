import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Slide } from "@material-ui/core";
import Link from "next/link";
import Hamburger from "hamburger-react";
import {
  CategoriesWrapper,
  HeaderLink,
  MUILink,
  NavLinks,
  NavLink,
  SearchIconStyled,
  SideMenuClose,
  SideMenuWrapper,
  SideMenuNavigation,
  SideMenuNavLinks,
  SideMenuNavLinkItem,
  SearchIconWrapper,
} from "./NavBarStyledBase";
import { useMediaQuery } from "react-responsive";
import config from "../../config.json";
import GlobalTheme from "../Theme/theme";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function NavBar({ props, atTop, className, toggleSearch }) {
  const [isActive, setIsActive] = useState(false);
  const trigger = useScrollTrigger();
  const isWideScreen = useMediaQuery({
    query: "(min-width: " + config.navMinWidth,
  });

  useEffect(() => {
    setIsActive(isActive && trigger ? false : isActive);
  }, [trigger]);

  return (
    <>
      <HideOnScroll {...props}>
        <AppBar color={atTop ? "transparent" : "primary"} className={className}>
          <Toolbar>
            <Typography variant="h6">
              <Link href="/" passHref>
                <HeaderLink>{config.blogName}</HeaderLink>
              </Link>
            </Typography>
            <CategoriesWrapper>
              <NavLinks>
                {config.navlinks.map((category, i) =>
                  category.primary && !category.external ? (
                    <NavLink key={i}>
                      <Typography variant="h6" color="textPrimary">
                        <Link href={category.link}>
                          <a>{category.name}</a>
                        </Link>
                      </Typography>
                    </NavLink>
                  ) : (
                    category.primary && (
                      <NavLink key={i}>
                        <Typography variant="h6" color="textPrimary">
                          <MUILink href={category.link} color="textPrimary">
                            {category.name}
                          </MUILink>
                        </Typography>
                      </NavLink>
                    )
                  )
                )}
              </NavLinks>
            </CategoriesWrapper>
            <SearchIconWrapper onClick={() => toggleSearch()}>
              <SearchIconStyled
                fontSize="large"
                style={{ fontSize: 26, color: GlobalTheme.textPrimary }}
              />
            </SearchIconWrapper>
            <Hamburger
              label="sidebar"
              toggled={isActive}
              toggle={setIsActive}
              color={GlobalTheme.textPrimary}
              size={26}
            />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <SideMenuClose isOpen={isActive} onClick={() => setIsActive(false)} />
      <SideMenuWrapper isOpen={isActive && !trigger}>
        <SideMenuNavigation>
          <SideMenuNavLinks>
            {isWideScreen
              ? config.navlinks.map((category, i) =>
                  !category.primary && !category.external ? (
                    <SideMenuNavLinkItem
                      key={i}
                      isOpen={isActive}
                      style={
                        isActive
                          ? {
                              transitionDelay:
                                (i - config.numPrimaryLinks) * 0.025 + "s",
                            }
                          : null
                      }
                    >
                      <Typography variant="h6" color="textPrimary">
                        <Link href={category.link} passHref>
                          <a>{category.name}</a>
                        </Link>
                      </Typography>
                    </SideMenuNavLinkItem>
                  ) : (
                    !category.primary && (
                      <SideMenuNavLinkItem
                        key={i}
                        isOpen={isActive}
                        style={
                          isActive
                            ? {
                                transitionDelay:
                                  (i - config.numPrimaryLinks) * 0.025 + "s",
                              }
                            : null
                        }
                      >
                        <Typography variant="h6" color="textPrimary">
                          <MUILink href={category.link}>
                            {category.name}
                          </MUILink>
                        </Typography>
                      </SideMenuNavLinkItem>
                    )
                  )
                )
              : config.navlinks.map((category, i) =>
                  !category.external ? (
                    <SideMenuNavLinkItem
                      key={i}
                      isOpen={isActive}
                      style={
                        isActive ? { transitionDelay: i * 0.025 + "s" } : null
                      }
                    >
                      <Typography variant="h6" color="textPrimary">
                        <Link href={category.link} passHref>
                          <a>{category.name}</a>
                        </Link>
                      </Typography>
                    </SideMenuNavLinkItem>
                  ) : (
                    <SideMenuNavLinkItem
                      key={i}
                      isOpen={isActive}
                      style={
                        isActive ? { transitionDelay: i * 0.025 + "s" } : null
                      }
                    >
                      <Typography variant="h6" color="textPrimary">
                        <MUILink href={category.link}>{category.name}</MUILink>
                      </Typography>
                    </SideMenuNavLinkItem>
                  )
                )}
          </SideMenuNavLinks>
        </SideMenuNavigation>
      </SideMenuWrapper>
      <Toolbar />
    </>
  );
}

export default NavBar;
