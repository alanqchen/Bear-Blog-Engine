import Header from '../Header/header'
import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, IconButton, Typography, Hidden, CssBaseline} from '@material-ui/core';
import SCtheme from '../../assets/theme/SCtheme';
import { Waypoint } from 'react-waypoint';
import { StyledCenteredContainer } from './publicLayoutStyled';
import { StyledNavBar } from '../PublicNavBar/NavBarStyled';

const publicLayoutStyle = {
    marginTop: 20,
    marginBottom: 20,
};

function publicLayout({children}) {
    // These hooks and useEffect is for the edge case where the user
    //   refreshes or goes back to the index page. In that case, the
    //   navbar has to detect that it needs to change the background color
    //   without the use of the waypoint.
    const [atTop, setAtTop] = useState(true);
    const [everEnter, setEverEnter] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const waypointEnter = () => {
        setEverEnter(true);
        setAtTop(true);
    }
    
    const waypointLeave = () => {
        setAtTop(false);
    }

    useEffect(() => { 
        if(isInitialLoad) {
            setIsInitialLoad(false);
        }
        if(!isInitialLoad && !everEnter) {
            setAtTop(false);
        }
    }, [atTop, isInitialLoad, everEnter]);

    return (

        <div style={publicLayoutStyle}>
            <StyledNavBar atTop={atTop} />
            <Waypoint onEnter={waypointEnter} onLeave={waypointLeave} />
            <StyledCenteredContainer>
                {children}
            </StyledCenteredContainer>
        </div>
    )
}

export default publicLayout;
