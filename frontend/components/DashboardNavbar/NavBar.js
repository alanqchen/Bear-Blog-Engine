import { useEffect, useState } from 'react';
import { 
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@material-ui/core';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    List as ListIcon,
    HomeOutlined as HomeIcon,
    GroupOutlined as EditorsIcon
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Router from "next/router";
import Link from 'next/link';
import {
    HeaderLink
} from '../PublicNavBar/NavBarStyledBase';
import config from '../../config.json';

const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    }
}));

export function NavBar({ className, selectedCategory }) {

    const categories = ['Posts', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5']
    const categoriesIcons = [<ListIcon />, <ListIcon />, <ListIcon />, <ListIcon />, <ListIcon />]
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const pushLink = (link) => {
        Router.push(link);
    }

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }
    
    const drawer = (
        <div>
            <List>
                <ListItem button onClick={()=>{pushLink("/")}} >
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary={'View site'} />
                </ListItem>
                <Divider />
                <ListItem button onClick={()=>{pushLink("/auth/portal/dashboard")}} selected={selectedCategory === "Posts" ? true : false} >
                    <ListItemIcon><ListIcon /></ListItemIcon>
                    <ListItemText primary={'Posts'} />
                </ListItem>
                <ListItem button onClick={()=>{pushLink("/auth/portal/dashboard")}} selected={selectedCategory === "Editors" ? true : false} >
                    <ListItemIcon><EditorsIcon /></ListItemIcon>
                    <ListItemText primary={'Editors'} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <AppBar position="fixed" color="primary" className={className} style={{zIndex:"99999"}}>
                <Toolbar>
                    <Typography variant="h6">
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link href="/auth/portal/dashboard" passHref>
                            <HeaderLink>{config.blogName}<Typography fontWeight="fontWeightLight" variant="subtitle1" component="h6" display="inline"> | Editor</Typography></HeaderLink>
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <IconButton onClick={handleDrawerToggle} className={classes.closeMenuButton}>
                            <CloseIcon/>
                        </IconButton>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.toolbar} />
                        {drawer}
                    </Drawer>  
                </Hidden>
            </nav>
        </>
    );
}

export default NavBar;
