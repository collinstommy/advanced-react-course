import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';


const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'tomcollins@test.com' }
    },
    result: {
      data: {
        requestReset: {
          message: 'success', __typename: 'Message'
        }
      }
    }
  }
];

describe('<RequestReset />', () => {
  it('renders and matches snapshop', async () => {
    const wrappper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrappper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate typing the email
    wrapper.find('input').simulate('change', {
      target:
        { name: 'email', value: 'tomcollins@test.com' }
    });
    const form = wrapper.find('form');
    form.simulate('submit');
    await wait(500);
    wrapper.update();
    expect(wrapper.find('p').text()).toContain('Success! Check your email for a reset link!');
  });
});
