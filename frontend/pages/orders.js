import PropTypes from 'prop-types';
import Order from '../components/Order';
import OrderList from '../components/OrderList';

const OrderPage = () => (
  <div>
    <OrderList />
  </div>
);

Order.propTypes = {
  id: PropTypes.string.isRequired
};

export default OrderPage;
