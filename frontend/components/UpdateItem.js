/* global fetch FormData */
import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { getDayOfYear } from 'date-fns/esm';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $title: String
    $description: String
    $price: Int
    $image: String
    $largeImage: String
) {
      updateItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class UpdateItem extends Component {
  handleChange = e => {
    const { name, value, type } = e.target;
    const val = type === 'number'
      ? parseFloat(value)
      : value;

    this.setState({
      [name]: val
    });
  }

  updateItem = async (e, mutation) => {
    e.preventDefault();
    const res = await mutation({
      variables: this.props.id,
      ...this.state
    });
  }

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{ id: this.props.id }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading</p>;
          if (!data.item) return <p>No items found.</p>;
          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={this.state}
            >
              {(updateItem, { mutationLoading, error }) => (
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await this.updateItem(e, updateItem);
                    Router.push({
                      pathname: '/item',
                      query: { id: res.data.updateItem.id }
                    });
                  }}
                >
                  <Error error={error} />
                  <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={this.state.title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={this.state.price}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        type="text"
                        name="description"
                        placeholder="Enter a Description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }
        }
      </Query >
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
