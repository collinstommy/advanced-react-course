import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'A cool item',
  price: 4000,
  description: 'This is a description',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg'
};

describe('<Item>', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent {...fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

// describe('<Item>', () => {
//   const wrapper = shallow(<ItemComponent {...fakeItem} />);

//   it('renders pricetag and title properly', () => {
//     const PriceTag = wrapper.find('PriceTag');
//     expect(PriceTag.children().text()).toBe('$50');
//     expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
//   });

//   it('renders the image properly', () => {
//     const image = wrapper.find('img');
//     expect(image.props().src).toBe(fakeItem.image);
//     expect(image.props().alt).toBe(fakeItem.title);
//   });

//   it('renders the button properly', () => {
//     const ButtonList = wrapper.find('.buttonList');
//     expect(ButtonList.children()).toHaveLength(3);
//     expect(ButtonList.find('Link').exists());
//     expect(ButtonList.find('DeleteItem').exists());
//   });
// });

