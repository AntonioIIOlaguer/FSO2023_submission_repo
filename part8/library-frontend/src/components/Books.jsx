import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "./queries";
import { useState } from "react";
import { useEffect } from "react";

const Books = (props) => {
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      let returnedGenres = [];
      data.allBooks.map((book) =>
        book.genres.map((genre) =>
          returnedGenres.includes(genre) ? null : returnedGenres.push(genre),
        ),
      );
      setGenres(returnedGenres);
    },
  });
  const [filter, setFilter] = useState("");
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    refetch({ genre: filter });
  }, [filter, refetch]);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map((genre) => (
        <button onClick={() => setFilter(genre)} key={genre}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter("")}>All genres</button>
    </div>
  );
};

export default Books;
