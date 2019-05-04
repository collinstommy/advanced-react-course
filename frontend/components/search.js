import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Router from 'next/router';
import Downshift, { resetIdCounter } from 'downshift';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEM_QUERY = gql`
  query SEARCH_ITEM_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm }
        { description_contains: $searchTerm }
      ]
    }){
      id
      image
      title
    }
  }
`;
const routeToItem = ({ id }) => {
  Router.push({
    pathname: '/item',
    query: {
      id
    }
  });
};

class Search extends React.Component {
  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    this.setState({
      loading: true
    });
    // manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEM_QUERY,
      variables: { searchTerm: e.target.value }
    });
    this.setState({
      items: res.data.items,
      loading: false
    });
  }, 350)

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          itemToString={item => (item === null ? '' : item.title)}
          onChange={routeToItem}
        >
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search For An Item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && <DropDown>
                {this.state.items.map((item, index) =>
                  <DropDownItem
                    {...getItemProps({
                      item,
                    })}
                    highlighted={index === highlightedIndex}
                    key={item.id}
                  >
                    <img src={item.image} width="50" alt={item.title} />
                    {item.title}
                  </DropDownItem>)}
                {!this.state.loading && <DropDownItem>Nothing found for {inputValue}</DropDownItem>}
              </DropDown>
              }
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;
