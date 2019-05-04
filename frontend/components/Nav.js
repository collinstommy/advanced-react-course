import { Fragment } from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';

const getCount = (cart) => cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);

const userNavItems = (cart) => {
  const count = getCount(cart);
  return (
    <Fragment>
      <Link href="/sell">
        <a>Sell</a>
      </Link>
      <Link href="/orders">
        <a>Orders</a>
      </Link>
      <Link href="/me">
        <a>Account</a>
      </Link>
      <Signout />
      <Mutation mutation={TOGGLE_CART_MUTATION}>
        {toggleCart =>
          (<button onClick={toggleCart}>
            My Cart
            <CartCount count={count} />
          </button>)}
      </Mutation>
    </Fragment>
  );
};

const guestNavItems = (
  <Link href="/signup">
    <a>Sign In</a>
  </Link>
);

const Nav = () => (
  <User>
    {({ data: { me } }) =>
      (<NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me ? userNavItems(me.cart) : guestNavItems}
      </NavStyles>)
    }
  </User>

);

export default Nav;

