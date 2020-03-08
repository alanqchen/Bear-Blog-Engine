import Header from './header'
import styled from 'styled-components';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import {AppBar, Toolbar, IconButton, Typography, Hidden, CssBaseline} from '@material-ui/core'

const postLayoutStyle = {

  margin: 20,
  padding: 20,
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

const CenteredContainer = ({className, children}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
  
}

const StyledCenteredContainer = styled(CenteredContainer)`
  display: flex;
  flex-direction: column;
`
const postLayout = (props) => (
  <div style={postLayoutStyle}>
    <NavBar></NavBar>
    <StyledCenteredContainer>
      {props.children}
    </StyledCenteredContainer>
  </div>
);

export default postLayout;
