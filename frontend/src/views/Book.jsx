/* eslint-disable react/prop-types */

import Header from "../components/Header.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import starIcon from "../assets/Star.svg";
import fullStarIcon from "../assets/Filled-Star.svg";
import styles from "../styles/Book.module.css";
import AddRec from "./BookComponents/AddRec.jsx";
import EditRec from "./BookComponents/EditRec.jsx";
import DefaultRec from "./BookComponents/DefaultRec.jsx";
import FilterRec from "./BookComponents/FilterRec.jsx";
import axios from "axios";

//onclick thumbs up /down
function Book() {
  let { isbn } = useParams();

  let [book, setBook] = useState(null);
  let [show, setShow] = useState("Default");
  let [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios
        .get("http://localhost:8800/book/" + isbn)
        .then((result) => {
          if (isMounted) {
            setBook(result.data[0]);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <div>Error</div>;

  return (
    <>
      <Header></Header>
      <main id={styles.main}>
        <div id={styles.squeeze} aria-hidden="true">
          <section id={styles.book} className={styles.container}>
            <div className={styles.holdIcon}>
              {book != null && book.Username != null ? (
                <img
                  alt="Filled Star"
                  aria-label="Is a Favorite of the Admin"
                  className={styles.icon}
                  src={fullStarIcon}
                ></img>
              ) : (
                <img
                  alt="Empty Star"
                  aria-label="Not a favorite of the Admin"
                  className={styles.icon}
                  src={starIcon}
                ></img>
              )}
            </div>
            {book != null && (
              <>
                <div className={styles.content}>
                  <header className={styles.header}>
                    <h3>{book.Title}</h3>
                    {book.Series_name != null && (
                      <h3>
                        {book.Series_name}, Book #{book.Book_order}
                      </h3>
                    )}
                    <h4 className={"secondary " + styles.h4}>
                      {book.Fname + " " + book.Lname}, {book.Publisher_name}
                    </h4>
                  </header>
                  <ul className={styles.ul} aria-label="Genres of this Book">
                    {book.Genre.map((genre) => {
                      return (
                        <li
                          className={"primary-bg " + styles.bubble}
                          key={genre}
                        >
                          {genre}
                        </li>
                      );
                    })}
                  </ul>
                  <p>{book.Summary}</p>
                </div>
                <a
                  className="secondary"
                  href={book.Purchase_link}
                  aria-label="Purchase link which takes you to the Amazon purchase page."
                >
                  Purchase Link
                </a>
              </>
            )}
          </section>
          <section className={styles.container} id={styles.recommendation}>
            <header id={styles.reccomendHeader}>
              <h2>Recommendations</h2>
              <Menu setShow={setShow}></Menu>
            </header>
            <RecommendationContent myShow={show}></RecommendationContent>
          </section>
        </div>
      </main>
    </>
  );
}

export function RecommendationContent({ myShow }) {
  let ans = <div>Error: No content selected. </div>;
  switch (myShow) {
    case "Add Recommendation":
      ans = <AddRec></AddRec>;
      break;
    case "Filter Recommendation":
      ans = <FilterRec></FilterRec>;
      break;
    case "Edit Recommendation":
      ans = <EditRec></EditRec>;
      break;
    default:
      ans = <DefaultRec></DefaultRec>;
  }

  return ans;
}

export function Menu({ setShow }) {
  const menuItems = [
    "Default",
    "Add Recommendation",
    "Edit Recommendation",
    "Filter Recommendation",
  ];

  function redirectLink(e) {
    setShow(e.target.value);
  }

  return (
    <>
      <label
        htmlFor={styles.menu}
        aria-label="Choose a Way to Interact With the Recommendation Section"
      ></label>
      <select onChange={redirectLink}>
        {menuItems.map((item) => {
          return (
            <option value={item} key={item}>
              {item}
            </option>
          );
        })}
      </select>
    </>
  );
}

export default Book;
