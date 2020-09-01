import { connect } from "react-redux";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import {
  StyledCenteredContainer,
  DashBoardWrapper,
} from "./dashboardLayoutStyled";
import NavBar from "../DashboardNavbar/NavBar";
import { refresh, setTokens } from "../../redux/auth/actions";

const dashboardLayoutStyle = {
  marginTop: 64,
  marginBottom: 20,
  flexGrow: 1,
};

function DashboardLayout({ auth, dispatch, children, selectedCategory }) {
  const [initAuth, setInitAuth] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const clearTokens = async () => {
      await dispatch(setTokens("", ""));
      localStorage.removeItem("bearpost.JWT");
      localStorage.removeItem("bearpost.REFRESH");
    };

    if (auth.error) {
      clearTokens();
      Router.push("/auth/portal/login");
      return;
    } else if (!auth.loading && !isInitialLoad) {
      setInitAuth(true);
      return;
    }

    const accessToken = localStorage.getItem("bearpost.JWT");
    const refreshToken = localStorage.getItem("bearpost.REFRESH");

    if (accessToken) {
      const setGetNewRefreshToken = async () => {
        await dispatch(setTokens(accessToken, refreshToken));
        await dispatch(refresh());
        if (auth.error) {
          clearTokens();
        } else {
          setIsInitialLoad(false);
        }
      };
      setGetNewRefreshToken();
    } else if (auth.accessToken !== "") {
      const getNewRefreshToken = async () => {
        await dispatch(refresh());
        if (auth.error) {
          clearTokens();
        } else {
          setIsInitialLoad(false);
        }
      };
      getNewRefreshToken();
    } else {
      clearTokens();
      Router.push("/auth/portal/login");
    }
  }, [auth.error, isInitialLoad]);

  return (
    <>
      <DashBoardWrapper>
        <NavBar selectedCategory={selectedCategory} />
        <div style={dashboardLayoutStyle}>
          <StyledCenteredContainer>
            {initAuth && <>{children}</>}
          </StyledCenteredContainer>
        </div>
      </DashBoardWrapper>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: {
      loading: state.auth.loading,
      error: state.auth.error,
    },
  };
};

export default connect(mapStateToProps)(DashboardLayout);
