import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const permissionTypes = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const Permissions = () => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => (
        <div>
          <Error error={error} />
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {permissionTypes.map(permission => <th key={permission}>{permission}</th>)}
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => <UserPermissions user={user} key={user.id} />)}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Query>
  );
};

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      Permissions: PropTypes.array
    })
  };

  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = ({ target }) => {
    const checkbox = target;
    const updatedPermissions = [...this.state.permissions];

    const permissions = checkbox.checked
      ? [...this.state.permissions, checkbox.value]
      : updatedPermissions.filter(permission => permission !== checkbox.value);

    this.setState({
      permissions
    });
  }

  render() {
    const { user: { name, email, id } } = this.props;

    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        {permissionTypes.map(permission => {
          const inputId = `${id}-permission-${permission}`;
          return (
            <td key={permission}>
              <label htmlFor={inputId}>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={this.state.permissions.includes(permission)}
                  value={permission}
                  onChange={this.handlePermissionChange}
                />
              </label>
            </td>
          );
        })}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
