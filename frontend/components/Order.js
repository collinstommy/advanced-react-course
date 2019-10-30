import React from 'react';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUER($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }

`;

const Order = ({ id }) => (
  <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
    {({ data, error, loading }) => {
      if (error) return <Error error={error} />;
      if (loading) return <p>loading</p>;
      const { order } = data;
      return (
        <OrderStyles data-test="order">
          <Head>
            <title>Order Id: {order.id}</title>
          </Head>
          <p>
            <span>Order ID:</span>
            <span>{id}</span>
          </p>
          <p>
            <span>Charge:</span>
            <span>{order.charge}</span>
          </p>
          <p>
            <span>Date:</span>
            <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
          </p>
          <p>
            <span>Order Total:</span>
            <span>{formatMoney(order.total)}</span>
          </p>
          <p>
            <span>Item Count:</span>
            <span>{order.items.length}</span>
          </p>
          <div className="items">
            {order.items.map(item => (
              <div className="order-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h2>{item.title}</h2>
                  <p>QTY:{item.quantity}</p>
                  <p>Subtotal:{formatMoney(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </OrderStyles>
      );
    }}
  </Query>
);

Order.propTypes = {};

export default Order;
