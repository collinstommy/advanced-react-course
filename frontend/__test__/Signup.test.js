import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';


const type = (wrapper, name, value) => {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value }
  });
};

const me = fakeUser();
const { email, name } = me;
const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name,
        email,
        password: 'wes'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email,
          name,
        }
      }
    }
  }, {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } }
  }
];

describe('<Signup >', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(<MockedProvider>
      <Signup />
    </MockedProvider>);
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('call the mutation properly', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    type(wrapper, 'name', name);
    type(wrapper, 'email', email);
    type(wrapper, 'password', 'wes');
    wrapper.update();
    wrapper.find('form').simulate('submit');
    await wait();
    // query user from client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});