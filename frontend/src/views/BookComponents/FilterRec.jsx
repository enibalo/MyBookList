import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import RecommendedCard from "./RecommendedCard.jsx";
import styles from "../../styles/Book.module.css";
import axios from "axios";

export default function FilterRec() {
  let { isbn } = useParams();
  let [reccs, setReccs] = useState(null);
  let [error, setError] = useState(false);

  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("currentUsername"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isAdmin) return;
    async function fetchData() {
      axios
        .get(
          "http://localhost:8800/book/" +
            isbn +
            "/recommendation?filter=true&username=" +
            username
        )
        .then((result) => {
          if (isMounted) {
            console.log(result.data);
            if (result.data.length == 0) setReccs(null);
            else setReccs(result.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
    fetchData();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, []);

  if (isAdmin == true) {
    return (
      <div className="secondary" id={styles.noReccs}>
        Only users can filter recommendations!
      </div>
    );
  }

  if (error) return <div>Error</div>;

  if (reccs == []) return <div>Loading...</div>;

  return (
    <>
      {reccs == null ? (
        <div className="secondary" id={styles.noReccs}>
          Be the first to recommend a book from a genre that you like!
        </div>
      ) : (
        <ul>
          {reccs.map((recc) => {
            return (
              <RecommendedCard
                key={recc.Username + "-" + recc.Recommended_isbn}
                recc={recc}
              ></RecommendedCard>
            );
          })}
        </ul>
      )}
    </>
  );
}
