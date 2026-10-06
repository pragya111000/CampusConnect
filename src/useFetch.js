import { useCallback, useEffect, useState } from "react";
import { apiGet } from "./api.js";

// Loads data from the backend and tells the screen what is happening:
//   loading -> true while we wait
//   error   -> a friendly message if the request failed (otherwise "")
//   reload  -> call it to try again
function useFetch(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    apiGet(path)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.error(`Error fetching ${path}:`, err);
        if (!cancelled) {
          setError("Could not load data. Please check that the backend server is running and try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // cleanup: ignore the answer if the page was closed meanwhile
    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => load(), [load]);

  return { data, loading, error, reload: load };
}

export default useFetch;
