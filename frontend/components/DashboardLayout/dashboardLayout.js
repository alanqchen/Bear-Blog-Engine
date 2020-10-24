import { connect } from "react-redux";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import {
  StyledCenteredContainer,
  DashBoardWrapper,
  ContentWrapper,
} from "./dashboardLayoutStyled";
import LinearProgress from "@material-ui/core/LinearProgress";
import { TableSkeleton } from "./dashboardLayoutSkeletons";
import NavBar from "../DashboardNavbar/NavBar";
import { refresh } from "../../redux/auth/actions";

function DashboardLayout({
  auth,
  dispatch,
  children,
  selectedCategory,
  skeletonType,
}) {
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
      {console.log("Test1")}
      <DashBoardWrapper>
        <NavBar selectedCategory={selectedCategory} />
        <ContentWrapper>
          {console.log("Test")}
          <StyledCenteredContainer>
            {initAuth ? (
              <>{children}</>
            ) : skeletonType === "table" ? (
              <>
                <LinearProgress />
              </>
            ) : (
              <>
                <TableSkeleton />
              </>
            )}
          </StyledCenteredContainer>
        </ContentWrapper>
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
