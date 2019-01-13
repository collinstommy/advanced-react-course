import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './styles/Error';
import Form from './styles/Form';


class Signup extends Component {
  render() {
    return (
      <Form>
        <fieldset>
          <h2>
            Sign Up for an Account
          </h2>
        </fieldset>
      </Form>
    );
  }
}

export default Signup;
