import { connect } from "react-redux";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import {
  StyledCenteredContainer,
  DashBoardWrapper,
} from "./dashboardLayoutStyled";
import NavBar from "../DashboardNavbar/NavBar";
import { refresh } from "../../redux/auth/actions";

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
    } else {
      const accessToken = localStorage.getItem("bearpost.JWT");
      const refreshToken = localStorage.getItem("bearpost.REFRESH");

      if (accessToken && refreshToken) {
        const setGetNewRefreshToken = async () => {
          await dispatch(refresh());
          if (auth.error) {
            clearTokens();
          } else {
            setIsInitialLoad(false);
          }
        };
        setGetNewRefreshToken();
      } else {
        clearTokens();
        Router.push("/auth/portal/login");
      }
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
