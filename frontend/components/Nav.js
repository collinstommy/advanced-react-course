import { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const userNavItems = (
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
  </Fragment>
);

const guestNavItems = (
  <Link href="/signup">
    <a>Sign In</a>
  </Link>
);

const Nav = () => (
  <User>
    {({ data: { me } }) => {
      return (<NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me ? userNavItems : guestNavItems}
      </NavStyles>);
    }
    }
  </User>

);

export default Nav;

