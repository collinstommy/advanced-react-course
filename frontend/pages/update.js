import PropTypes from 'prop-types';
import UpdateItem from '../components/CreateItem';

const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

Sell.propTypes = {
  query: PropTypes.object
};

export default Sell;
