
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import User, { CURRENT_USER_QUERY } from './User';
import calcTotalPrice from '../lib/calcTotalPrice';

const totalItems = cart => cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends Component {
  onToken = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: res.id
      }
    });
    Router.push({
      pathname: '/order',
      query: {
        id: order.data.createOrder.id
      }
    });
  }
  render() {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if (loading || !me) return null;
          const image = me && me.cart.length && me.cart[0].item && me.cart[0].item.image;
          return (<Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}>{(createOrder) => (<StripeCheckout
              amount={calcTotalPrice(me.cart)}
              name="Sick Fits"
              description={`Order of ${totalItems(me.cart)} items`}
              image={image}
              stripeKey="pk_test_PXbHfj3HGeUrzCtOPOnnZpWe00wjNLwDCj"
              curreny="USD"
              email={me.email}
              token={res => this.onToken(res, createOrder)}
            >
              {this.props.children}
            </StripeCheckout>
            )
            }
          </Mutation>);
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
