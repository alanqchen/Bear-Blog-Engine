import Header from './header'
import styled from 'styled-components';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import {AppBar, Toolbar, IconButton, Typography, Hidden, CssBaseline} from '@material-ui/core'

const publicLayoutStyle = {

  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
  
const NavBar = (props) => {
  return (
    <>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Bear Post Blog</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar/>
    </>
  );
}

const CenteredContainer = (props) => {
  return (
    <>
      {props.children}
    </>
  );
  
}

const StyledCenteredContainer = styled(({ className, ...props }) => (
  <CenteredContainer {...props} classes={{ paper: className }} />
))`
  display: flex;
  justify-content: center;
  max-width: 80%;
`

const publicLayout = (props) => (
  <div style={publicLayoutStyle}>
    <NavBar></NavBar>
    <StyledCenteredContainer>
      {props.children}
    </StyledCenteredContainer>
  </div>
);

export default publicLayout;
