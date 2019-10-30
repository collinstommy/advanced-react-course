import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';
import { fakeUser, fakeCartItem, fakeOrder } from '../lib/testUtils';
import { CURRENT_USER_QUERY } from '../components/User';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import NProgress from 'nprogress';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';

const mocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: {
        id: 'ord123'
      }
    },
    result: {
      data: { order: fakeOrder() }
    }
  }
];


describe('Order', () => {
  it('renders the order', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const order = wrapper.find('div[data-test="order"]');
    expect(toJSON(order)).toMatchSnapshot();
  });
});
