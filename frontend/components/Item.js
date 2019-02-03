import Link from 'next/link';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

class Item extends Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string
  }

  render() {
    const {
      title,
      id,
      price,
      description,
      image
    } = this.props;
    
    return (
      <ItemStyles>
        {image && <img src={image} alt={title} />}
        <Title>
          <Link
            href={{
              pathname: '/item',
              query: { id }
            }}
          >
            <a>{title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(price)}</PriceTag>
        <p>{description}</p>
        <div className="buttonList">
          <Link
            href={{
              pathname: 'update',
              query: { id }
            }}
          >
            <a>Edit ✏️</a>
          </Link>
          <AddToCart id={id} />
          <DeleteItem id={id}>Delete Item</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}

export default Item;
