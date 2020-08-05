import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Link from 'next/link';
import {
    HeaderLink
} from '../PublicNavBar/NavBarStyledBase';
import config from '../../config.json';

export function NavBar({ className }) {

    return (
        <AppBar position="static" color="primary" className={className}>
            <Toolbar>
                <Typography variant="h6">
                    <Link href="/" passHref>
                        <HeaderLink>{config.blogName}<Typography variant="overline">Editor</Typography></HeaderLink>
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
