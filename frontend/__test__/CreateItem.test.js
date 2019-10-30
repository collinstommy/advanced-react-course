/* eslint-disable no-undef */
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';

const dogImage = 'https://dog.com/dog.jpg';

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }],
  }),
});

describe('<CreateItem />', () => {
  it('renders and matches snapshop', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('it uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', {
      target:
        { files: ['fakedog.jsp'] }
    });
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state.image).toEqual(dogImage);
    expect(component.state.largeImage).toEqual(dogImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    wrapper.find('#title').simulate('change', {
      target: {
        value: 'Testing', name: 'title'
      }
    });
    wrapper.find('#price').simulate('change', {
      target: {
        value: 50000, name: 'price', type: 'number'
      }
    });
    wrapper.find('#description').simulate('change', {
      target: {
        value: 'This is a really nice item', name: 'description'
      }
    });

    const component = wrapper.find('CreateItem').instance();
    expect(component.state).toMatchObject({
      title: 'Testing',
      price: 50000,
      description: 'This is a really nice item',
    });
  });

  it('creates an item when the form is submitted', async () => {
    const myFakeItem = fakeItem();
    const { price, title, description } = myFakeItem;
    const mocks = [{
      request: {
        query: CREATE_ITEM_MUTATION,
        variables: {
          title,
          description,
          price,
          image: '',
          largeImage: '',
        }
      },
      result: {
        data: {
          createItem: {
            ...myFakeItem,
            __typename: 'Item'
          }
        }
      }
    }];


    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    // simulate someone filling out the form
    wrapper.find('#title').simulate('change', { target: { value: myFakeItem.title, name: 'title' } });

    wrapper
      .find('#price')
      .simulate('change', { target: { value: myFakeItem.price, name: 'price', type: 'number' } });

    wrapper
      .find('#description')
      .simulate('change', { target: { value: myFakeItem.description, name: 'description' } });
    // mock the router
    Router.router = { push: jest.fn() };
    wrapper.find('form').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/item', query: { id: 'abc123' } });
  });
});

