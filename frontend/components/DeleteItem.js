/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';


const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
export class DeleteItem extends Component {
  update = (cache, payload) => {
    // payload from data that is returned
    // read the cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // filter the deleted item out of the paage
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // put items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button type="button"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (confirm('Are you sure you want to delete this?')) {
                deleteItem().catch(err => {
                  // eslint-disable-next-line no-alert
                  alert(err.message);
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )
        }

      </Mutation>
    );
  }
}

DeleteItem.propTypes = {}

export default DeleteItem;
