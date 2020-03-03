import Link from 'next/link';
import Layout from '../components/publicLayout';
import PostLink from '../components/postLink';
import fetch from 'isomorphic-unfetch'

import Pagination from '../components/pagination';
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PostsContainer from '../components/postsContainer'

const Container = styled.div`
  width: 960px;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: #f2f2f2;
  font-family: Roboto;
`

const Heading = styled.h1``

const useStyles = makeStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  });

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

  const Home = () => {
    const classes = useStyles();
    return (
      <Container>
        <Paper className={classes.root}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    )
  }

var maxID = -1;

const Index = props => (
        
        <Layout>
           <PostsContainer></PostsContainer>
            <button>Trigger Paginate</button>
            <Container>
            <Heading>Testing Styled Components</Heading>
            
            </Container>
            <Home></Home>

        </Layout>
        
);


Index.getInitialProps = async function() {
    
    const jsonBody = {
        maxID: "-1"
    }
    const res = await fetch('http://localhost:8080/api/v1/posts/get', {
        method: 'post',
        body: JSON.stringify(jsonBody)
    });
    const reqRes = await res.json();
  
    console.log(`Show data fetched. Count: ${reqRes.pagination.perPage}`);
  
    return {
      posts: reqRes.data.map(post => post)
    };
    
}

export default Index;
  
