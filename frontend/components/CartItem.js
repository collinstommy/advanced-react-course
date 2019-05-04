import React from 'react';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemsStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3, p {
    margin: 0;
  }
`;

const CartItem = ({ item, quantity, id }) => (
  <CartItemsStyles>
    <img width="100" src={item.image} alt={item.title} />
    <div className="cart-item-details">
      <h3>{item.title}</h3>
      <p>
        {formatMoney(item.price * quantity)}
        {' - '}
        <em>
          {quantity} &times; {formatMoney(item.price)} each
        </em>
      </p>
      <RemoveFromCart id={id} />
    </div>
  </CartItemsStyles>
);

export default CartItem;
