import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';

Router.router = {
  push: {},
  prefetch() {},
};

const makeMocksFor = length => {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              count: length,
              __typename: 'count',
            },
          },
        },
      },
    },
  ];
};

const getMountedPagination = (length, page = 1) => mount(
  <MockedProvider mocks={makeMocksFor(length)}>
    <Pagination page={page} />
  </MockedProvider>
);

describe('<Pagination>', () => {
  it('dispalays a loading message', () => {
    const wrapper = getMountedPagination(1);
    expect(wrapper.text()).toContain('Loading');
  });

  it('renders pagination for 18 items', async () => {
    const wrapper = getMountedPagination(18);
    await wait();
    wrapper.update();
    expect(wrapper.find('.total-pages').text()).toEqual('5');
    const pagination = wrapper.find('div[data-test="pagination"]');
    expect(toJSON(pagination)).toMatchSnapshot();
  });

  it('disables prev button on first page', async () => {
    const wrapper = getMountedPagination(18);
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
  });
  it('disableds next button on last page', async () => {
    const wrapper = getMountedPagination(18, 5);
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
  });
  it('enables all buttons on middle page', async () => {
    const wrapper = getMountedPagination(18, 3);
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
  });
});
