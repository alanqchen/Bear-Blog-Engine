import { connect } from 'react-redux';
import { setTokens } from '../../redux/auth/actions';
import { useState } from 'react';
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
    Divider,
    Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    List as ListIcon,
    HomeOutlined as HomeIcon,
    GroupOutlined as EditorsIcon,
    ExitToApp as ExitIcon
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Router from 'next/router';
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

function NavBar({ className, selectedCategory, auth, dispatch }) {

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");

    // SNACKBAR
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const pushLink = (link) => {
        Router.push(link);
    }

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    const doLogout = async() => {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/logout', {
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("bearpost.JWT")
            }
        })
        .then(res => res.json())
        .then(async(json) => {
            if(json.success) {
                localStorage.removeItem("bearpost.JWT");
                localStorage.removeItem("bearpost.REFRESH");
                await dispatch(setTokens("", ""));
                setIsError(false);
                setAlertMsg("Logged out! Redirecting...");
                setAlertOpen(true);
                await new Promise(r => setTimeout(r, 2000));
                Router.push("/auth/portal/login");
            } else {
                setIsError(true);
                setAlertMsg(json.message);
                setAlertOpen(true);
            }
        })
        .catch(() => {
            setIsError(true);
            setAlertMsg("Failed to logout!")
            setAlertOpen(true);
        });
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
                <ListItem button onClick={()=>{pushLink("/auth/portal/dashboard/editors")}} selected={selectedCategory === "Editors" ? true : false} >
                    <ListItemIcon><EditorsIcon /></ListItemIcon>
                    <ListItemText primary={'Editors'} />
                </ListItem>
                <Divider />
                <ListItem button 
                    onClick={async() => {
                        await doLogout();
                    }} 
                >
                    <ListItemIcon><ExitIcon /></ListItemIcon>
                    <ListItemText primary={'Log Out'} />
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
            
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert elevation={6} variant="filled" onClose={handleClose} severity={isError ? "error" : "success"}>
                    {alertMsg}
                </Alert>
            </Snackbar>
        </>
    );
}

export default connect()(NavBar);
