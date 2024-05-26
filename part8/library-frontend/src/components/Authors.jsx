import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS } from './queries';
import { useState } from 'react';
import { EDIT_AUTHOR } from './mutations';

const Authors = (props) => {
  const [authorToChange, setAuthorToChange] = useState('');
  const [born, setBorn] = useState('');
  const [updateBorn] = useMutation(EDIT_AUTHOR);

  const authors = useQuery(ALL_AUTHORS);
  if (!props.show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading...</div>;
  }

  const submit = async (event) => {
    event.preventDefault();
    updateBorn({
      variables: { name: authorToChange, setBornTo: Number(born) },
      refetchQueries: [{ query: ALL_AUTHORS }],
    });
    setBorn('');
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <select
          value={authorToChange}
          onChange={({ target }) => setAuthorToChange(target.value)}
        >
          {authors.data.allAuthors.map((a) => (
            <option value={a.name} key={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          born{' '}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">change</button>
      </form>
    </div>
  );
};

export default Authors;
