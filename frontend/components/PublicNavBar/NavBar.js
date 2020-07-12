import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, IconButton, Typography, Slide, ClickAwayListener} from '@material-ui/core'
import Link from 'next/link';
import Hamburger from 'hamburger-react'
import { 
    CategoriesWrapper,
    HeaderLink,
    NavLinks,
    NavLink,
    SearchIconStyled,
    SideMenuClose,
    SideMenuWrapper,
    SideMenuNavigation,
    SideMenuNavLinks,
    SideMenuNavLinkItem
} from './NavBarStyledBase'
import config from '../../config.json'
import GlobalTheme from '../Theme/theme'

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function NavBar({props, atTop, className}) {

    const [isActive, setIsActive] = useState(false);
    const trigger = useScrollTrigger();
    
    useEffect(() => {
        setIsActive(isActive && trigger ? false : isActive);
    }, [trigger]);

    return (
        <>
            <HideOnScroll {...props}>
                <AppBar color={atTop ? 'transparent' : 'primary'} className={className}>
                    <Toolbar>
                        <Typography variant="h6">
                            <Link href="/" passHref>
                                <HeaderLink>{config.blogName}</HeaderLink>
                            </Link>
                        </Typography>
                        <CategoriesWrapper>
                            <NavLinks>
                            {config.categories.map((category, i) => (
                                <NavLink key={i}>
                                    <Typography variant="h6" color="textPrimary">
                                        <Link href={config.categoryLinks[i]} passHref>
                                            <a>{category}</a>
                                        </Link>
                                    </Typography>
                                </NavLink>
                            ))}
                            </NavLinks>
                        </CategoriesWrapper>
                        <SearchIconStyled fontSize="large" style={{ fontSize: 26, color: GlobalTheme.textPrimary }}/>
                        <Hamburger toggled={isActive} toggle={setIsActive} color={GlobalTheme.textPrimary} size={26} style={{ zIndex: 13 }}/>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <SideMenuClose isOpen={isActive} onClick={() => setIsActive(false)} />
            <SideMenuWrapper isOpen={isActive && !trigger}>

                    <SideMenuNavigation>
                        <SideMenuNavLinks>
                        {config.categories.map((category, i) => (
                            <SideMenuNavLinkItem key={i} isOpen={isActive} style={isActive ? { transitionDelay: i * 0.02 + "s"} : null } primary>
                                <Typography variant="h6" color="textPrimary">
                                    <Link href={config.categoryLinks[i]} passHref>
                                        <a>{category}</a>
                                    </Link>
                                </Typography>
                            </SideMenuNavLinkItem>
                        ))}
                        {config.secondaryCategories.map((secondaryCategory, i) => (
                            <SideMenuNavLinkItem key={i} isOpen={isActive} style={isActive ? { transitionDelay: i * 0.02 + "s"} : null }>
                                <Typography variant="h6" color="textPrimary">
                                    <Link href={config.secondaryLinks[i]} passHref>
                                        <a>{secondaryCategory}</a>
                                    </Link>
                                </Typography>
                            </SideMenuNavLinkItem>
                        ))}
                        </SideMenuNavLinks>
                    </SideMenuNavigation>

            </SideMenuWrapper>
            <Toolbar/>
        </>
    );
}

export default NavBar;
