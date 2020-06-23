import Header from '../Header/header'
import styled from 'styled-components';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import {AppBar, Toolbar, IconButton, Typography, Hidden, CssBaseline} from '@material-ui/core'
import Select from '@atlaskit/select';
import SCtheme from '../../assets/theme/SCtheme'

/* These are just placeholder values for now */
const TagSelect = ({className, children}) => (
  <Select
    className={"multi-select" + className}
    classNamePrefix="react-select"
    options={[
      { label: 'Travel', value: 'adelaide' },
      { label: 'Coasters', value: 'brisbane' },
      { label: 'Technology', value: 'canberra' },
      { label: 'Coding', value: 'darwin' },
      { label: 'Projects', value: 'hobart' },
    ]}
    isMulti
    isSearchable={false}
    placeholder="Choose tags to search"
  />
);

const StyledTagSelect = styled(TagSelect)`
  width: 95%;
  max-width: 900px;
  margin-bottom: 20px;
  color: white !important;
  & > * {
    background-color: ${SCtheme.backgroundDarkLight};
    color: white;
    border-color: ${SCtheme.backgroundDarkAlt};
  }
  & > * : hover {
    background-color: #17223b !important;
    color: white;
    border-color: ${SCtheme.backgroundDarkAlt};
  }
`

const publicLayoutStyle = {

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
  align-items: center;
  background-color: #0e0e10;
`

const publicLayout = (props) => (
  <div style={publicLayoutStyle}>
    <NavBar></NavBar>
    <StyledCenteredContainer>
      <StyledTagSelect></StyledTagSelect>
      {props.children}
    </StyledCenteredContainer>
  </div>
);

export default publicLayout;
