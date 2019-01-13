import SingleItem from '../components/SingleItem';

const Item = ({ query }) => {
  console.log(query);
  return <SingleItem id={query.id} />
};

export default Item;
