import UpdateItem from '../components/CreateItem';
import PropTypes from 'prop-types';

const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

Sell.propTypes = {
  query: PropTypes.objec
}

export default Sell;
