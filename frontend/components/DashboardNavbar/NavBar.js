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
    ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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

export function NavBar({ className }) {

    const categories = ['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5']
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <div>
            <List>
                {categories.map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
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
