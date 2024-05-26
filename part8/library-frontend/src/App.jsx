import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import Recommended from "./components/Recommended";
import { ALL_BOOKS, BOOK_ADDDED, MY_FAVORITE } from "./components/queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const { refetch: favoriteRefetch } = useQuery(MY_FAVORITE);
  const client = useApolloClient();
  useEffect(() => {
    favoriteRefetch();
  }, [token, favoriteRefetch]);

  useSubscription(BOOK_ADDDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      console.log(client.cache.extract());
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: "" } },
        (cachedData) => {
          console.log("cachedData before update:", cachedData);

          if (!cachedData || !cachedData.allBooks) {
            console.log("No cached data, initializing with added book");
            return { allBooks: [addedBook] };
          }

          console.log("Updating cache with added book");
          return {
            allBooks: [...cachedData.allBooks, addedBook],
          };
        },
      );
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>Login</button>}
        {token && (
          <>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} />
      {token && <Recommended show={page === "recommended"} />}
    </div>
  );
};

export default App;
