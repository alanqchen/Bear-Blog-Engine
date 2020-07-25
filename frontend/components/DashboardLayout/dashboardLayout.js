import React, { useEffect, useState } from 'react';
import { StyledCenteredContainer } from './dashboardLayoutStyled';
import { NavBar } from '../DashboardNavbar/NavBar';

const dashboardLayoutStyle = {
    marginTop: 20,
    marginBottom: 20,
};

function dashboardLayout({children}) {
    return (
        <>
            <NavBar />
            <div style={dashboardLayoutStyle}>
                <StyledCenteredContainer>
                    {children}
                </StyledCenteredContainer>
            </div>
        </>
    )
}

export default dashboardLayout;
