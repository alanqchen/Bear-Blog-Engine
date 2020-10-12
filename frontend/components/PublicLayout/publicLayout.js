import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { StyledCenteredContainer, WidthWrapper } from "./publicLayoutStyled";
import { StyledNavBar } from "../PublicNavBar/NavBarStyled";
import { Collapse, Typography, Link } from "@material-ui/core";
import SearchBar from "./searchBar";

const publicLayoutStyle = {
  marginTop: 20,
  marginBottom: 20,
};

function publicLayout({ children }) {
  // These hooks and useEffect is for the edge case where the user
  //   refreshes or goes back to the index page. In that case, the
  //   navbar has to detect that it needs to change the background color
  //   without the use of the waypoint.
  const [atTop, setAtTop] = useState(true);
  const [everEnter, setEverEnter] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const waypointEnter = () => {
    setEverEnter(true);
    setAtTop(true);
  };

  const waypointLeave = () => {
    setAtTop(false);
  };

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
    if (!isInitialLoad && !everEnter) {
      setAtTop(false);
    }
  }, [atTop, isInitialLoad, everEnter]);

  const toggleSearch = () => {
    if (!showSearch) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setShowSearch(!showSearch);
  };

  return (
    <div style={publicLayoutStyle}>
      <StyledNavBar atTop={atTop} toggleSearch={() => toggleSearch()} />
      <Waypoint onEnter={waypointEnter} onLeave={waypointLeave} />
      <StyledCenteredContainer>
        <WidthWrapper>
          <Collapse in={showSearch}>
            <SearchBar />
          </Collapse>
        </WidthWrapper>
        {children}
        <Typography align="center" color="textSecondary" gutterBottom>
          Powered by{" "}
          <Link
            href="https://github.com/alanqchen/Bear-Blog-Engine"
            color="textSecondary"
          >
            Bear Blog Engine
          </Link>
        </Typography>
      </StyledCenteredContainer>
    </div>
  );
}

export default publicLayout;
