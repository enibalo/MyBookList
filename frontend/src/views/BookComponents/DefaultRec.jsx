import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import RecommendedCard from "./RecommendedCard.jsx";
import styles from "../../styles/Book.module.css";
import axios from "axios";

export default function DefaultRec() {
  let { isbn } = useParams();
  const [reccs, setReccs] = useState([]);
  let [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios
        .get(
          "http://localhost:8800/book/" + isbn + "/recommendation?filter=false"
        )
        .then((result) => {
          if (isMounted) {
            console.log(result.data);
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

  if (error) {
    return (
      <div className="secondary" id={styles.noReccs}>
        Error, please try again.
      </div>
    );
  }

  if (reccs == null) {
    console.log(`reccs is ${reccs}`);
    return (
      <div className="secondary" id={styles.noReccs}>
        Loading...
      </div>
    );
  }

  if (reccs.length == 0) {
    console.log(`reccs is ${reccs}`);
    return (
      <div className="secondary" id={styles.noReccs}>
        Be the first to recommend a book!
      </div>
    );
  }
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
