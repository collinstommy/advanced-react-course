import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id){
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${({ theme }) => theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => {
  // this get called as soon as we get a response back
  const update = (cache, payload) => {
    // read cache
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY
    });
    const cartItemId = payload.data.removeFromCart.id;
    console.log(data);
    // remove item from cart
    data.me.cart = data.me.cart.filter(cartItem => cartItemId !== cartItem.id);

    // write back to cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id }}
      update={update}
      optimisticResponse={{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          id
        }
      }}
    >
      {
        (removeFromCart, { loading, error }) =>
          (<BigButton
            title="Delete Item"
            disabled={loading}
            onClick={() => removeFromCart().catch(err => console.log(err))}
          >
            &times;
          </BigButton>)
      }
    </Mutation>
  );
};

RemoveFromCart.propTypes = {
  id: PropTypes.string,
};

export default RemoveFromCart;
