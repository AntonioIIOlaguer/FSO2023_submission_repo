import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import BlogForm from './BlogForm';
import * as reducer from '../reducers/blogReducer';
import { Provider } from 'react-redux';
import store from '../reducers/store';

describe('<Blog />', () => {
  let container;
  const ReduxProvider = ({ children, reduxStore }) => (
    <Provider store={reduxStore}>{children}</Provider>
  );

  const blog = {
    title: 'Testing blog list app',
    author: 'Blog Tester',
    likes: 14,
    url: 'https://test.com',
    user: { name: 'tester', id: '123' },
  };

  beforeEach(() => {
    container = render(
      <Provider store={store}>
        <Blog blog={blog} />
      </Provider>,
    ).container;
  });

  test('Renders only the blog title and author', async () => {
    expect(await container.querySelector('.title')).toHaveTextContent(
      'Testing blog list app',
    );
    expect(await container.querySelector('.author')).toHaveTextContent(
      'Blog Tester',
    );
    expect(await container.querySelector('.url')).toBeNull();
    expect(await container.querySelector('.likes')).toBeNull();
  });

  test('Likes are shown when view button is clicked', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('View');
    await user.click(viewButton);
    expect(await container.querySelector('.likes')).toHaveTextContent(14);
  });

  test('Like button clicked twice', async () => {
    const likeHandler = vi
      .spyOn(reducer, 'likeBlog')
      .mockImplementation(() => {});

    const user = userEvent.setup();
    const viewButton = screen.getByText('View');
    await user.click(viewButton);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);
    expect(likeHandler.mock.calls).toHaveLength(2);
  });
});

describe('<BlogForm />', () => {
  test('Submits the right new blog details', async () => {
    const addBlog = vi.fn();
    const container = render(<BlogForm addBlog={addBlog} />).container;

    const user = userEvent.setup();
    const titleInput = container.querySelector('#title');
    const authorInput = container.querySelector('#author');
    const urlInput = container.querySelector('#url');
    const submit = screen.getByText('create');
    await user.type(titleInput, 'Testing the BlogForm');
    await user.type(authorInput, 'Tester');
    await user.type(urlInput, 'https://test.test');
    await user.click(submit);

    const expectedObject = {
      title: 'Testing the BlogForm',
      author: 'Tester',
      url: 'https://test.test',
    };
    expect(addBlog.mock.calls).toHaveLength(1);
    console.log(addBlog.mock.calls[0][0]);
    expect(addBlog.mock.calls[0][0]).toStrictEqual(expectedObject);
  });
});
