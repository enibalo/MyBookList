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

  let username = "";

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios.get("http://localhost:8800/book/" + isbn + "/recommendation?filter=true&username=" + username)
      .then((result)=>{
        if (isMounted) {
          console.log(result.data);
          setReccs(result.data);
        }
      })
      .catch((error)=>{
        console.log(error);
        setError(true);
      });
    }
    fetchData();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, []);

  if (error) return <div>Error</div>;

  if (reccs == []) return <div>Loading...</div>;

  return (
    <>
      {reccs == null ? (
        <div className="secondary" id={styles.noReccs}>
          Be the first to recommend a book!
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



