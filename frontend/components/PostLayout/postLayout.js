import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { StyledNavBar } from "../PublicNavBar/NavBarStyled";
import { StyledCenteredContainer, WidthWrapper } from "./postLayoutSyled";
import { Collapse } from "@material-ui/core";
import SearchBar from "../PublicLayout/searchBar";

const postLayoutStyle = {
  marginTop: 20,
  marginBottom: 20,
};

function postLayout({ children }) {
  // These hooks and useEffect is for the edge case where the user
  //   refreshes or goes back to the post page. In that case, the
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
    <div style={postLayoutStyle}>
      <StyledNavBar atTop={atTop} toggleSearch={() => toggleSearch()} />
      <Waypoint onEnter={waypointEnter} onLeave={waypointLeave} />
      <StyledCenteredContainer>
        <WidthWrapper>
          <Collapse in={showSearch}>
            <SearchBar />
          </Collapse>
          {children}
        </WidthWrapper>
      </StyledCenteredContainer>
    </div>
  );
}

export default postLayout;
