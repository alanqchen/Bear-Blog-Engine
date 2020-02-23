import Header from './header'

const publicLayoutStyle = {

  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};
  
const publicLayout = props => (
  <div style={publicLayoutStyle}>
    <Header />
    {props.children}
  </div>
);

export default publicLayout;
