import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import RecommendedCard from "./RecommendedCard.jsx";
import styles from "../../styles/Book.module.css";

export default function FilterRec() {
  let { isbn } = useParams();
  let [reccs, setReccs] = useState(null);
  let [error, setError] = useState(false);

  let username = "";

  useEffect(() => {
    let isMounted = true;
    fetchFilteredReccs(isbn, username)
      .then((result) => {
        if (isMounted) {
          setReccs(result);
        }
      })
      .catch((error) => {
        setError(true);
      });
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

//have to create SQL QUERY for FILTERED RECCS
async function fetchFilteredReccs(isbn, username) {
  const reccs = [
    {
      Book_isbn: 1,
      Recommended_isbn: 2,
      Comment: "This book offers great insights!",
      Up_vote: 10,
      Down_vote: 1,
      Username: "reader123",
      Title: "Recommended Book Title",
      Fname: "Alice",
      Lname: "Smith",
    },
    {
      Book_isbn: 1,
      Recommended_isbn: 3,
      Comment:
        "Explanation: Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.",
      Up_vote: 7,
      Down_vote: 0,
      Username: "booklover89",
      Title: "Another Recommended Book",
      Fname: "Bob",
      Lname: "Johnson",
    },
  ];
  return reccs;
}

/*
<select id="linkSelect" onchange="redirectToLink()">
<option value="">Select an option...</option>
<option value="https://example.com/page1">Go to Page 1</option>
<option value="https://example.com/page2">Go to Page 2</option>
<option value="https://example.com/page3">Go to Page 3</option>
</select>
*/
