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

  let [username, setUsername] = useState(localStorage.getItem("username"));
  let [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );

  useEffect(() => {
    let isMounted = true;
    if (isAdmin) return;
    async function fetchData() {
      axios
        .get(
          "http://localhost:8800/books/" +
            isbn +
            "/recommendations/filtered?username=" +
            username
        )
        .then((result) => {
          if (isMounted) {
            setReccs(result.data);
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

  if (error)
    return (
      <div className="secondary" id={styles.noReccs}>
        Error
      </div>
    );

  if (reccs == null)
    return (
      <div className="secondary" id={styles.noReccs}>
        Loading...
      </div>
    );

  if (reccs.length == 0)
    return (
      <div className="secondary" id={styles.noReccs}>
        Be the first to recommend a book from a genre that you like!
      </div>
    );

  return (
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
  );
}
