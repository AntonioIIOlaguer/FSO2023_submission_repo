import { useQuery } from "@apollo/client";
import { ALL_BOOKS, MY_FAVORITE } from "./queries";
import { useEffect } from "react";

const Recommended = ({ show }) => {
  const genre = useQuery(MY_FAVORITE);
  const allBooks = useQuery(ALL_BOOKS);

  useEffect(() => {
    allBooks.refetch({ genre: genre.data.me?.favoriteGenre });
  }, [allBooks, genre]);

  if (!show) return null;
  if (allBooks.loading || genre.loading) return <div>...Loading</div>;

  return (
    <div>
      <h2> Recommendations</h2>
      <p>
        books in your favorite genre{" "}
        <strong>{genre.data.me.favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
