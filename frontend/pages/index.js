import Layout from '../components/PublicLayout/publicLayout';
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {AppBar, Toolbar, IconButton, Typography, Hidden, CssBaseline} from '@material-ui/core'
import PostsContainer from '../components/Posts/postsContainer'
import API from '../api'

const Container = styled.div`
  width: 960px;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: #f2f2f2;
  font-family: Roboto;
`

const Heading = styled.h1``

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const NavBar = (props) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Scroll to Hide App Bar</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar/>
    </React.Fragment>
  );
}


function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Index = props => (
        
  <Layout> 
      <PostsContainer buildPosts={props.buildPosts}></PostsContainer>        
  </Layout>
        
);

// TODO: use getServerSideProps
export async function getServerSideProps() {
  // Call API
  const jsonBody = {
    maxID: "-1"
  }
  const res = await fetch(API.url+'/api/v1/posts/get', {
    method: 'post',
    body: JSON.stringify(jsonBody)
  })
  const posts = await res.json()

  return {
    props: {
      buildPosts: posts
    }
  }
}

export default Index;
  
