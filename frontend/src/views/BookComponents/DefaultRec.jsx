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
      axios.get("http://localhost:8800/book/" + isbn + "/recommendation?filter=false")
      .then((result)=>{
        if (isMounted) {
          console.log(result.data);
          if (result.data.length == 0 ) setReccs(null);
          else setReccs(result.data);
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

