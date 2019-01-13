import Items from '../components/Items';

const Home = ({ query }) => (
  <div>
    <p>hey</p>
    <Items page={parseFloat(query.page) || 1} />
  </div>
);

export default Home;
