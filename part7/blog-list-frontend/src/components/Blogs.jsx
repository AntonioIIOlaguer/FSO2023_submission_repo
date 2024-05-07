import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 3,
    paddingRight: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      {blogs.map((blog) => (
        <div style={blogStyle} key={blog.id}>
          <Link to={'/blogs/' + blog.id}>{blog.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
