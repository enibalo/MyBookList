import { useState } from "react";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import thumbsUp from "../../assets/Thumbs-up.svg";
import thumbsDown from "../../assets/Thumbs-down.svg";
import styles from "../../styles/Book.module.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function RecommendedCard({ recc }) {
  let { isbn } = useParams();
  let [upVote, setUpVote] = useState(0);
  let [downVote, setDownVote] = useState(0);
  let [clickedUp, setClickedUp] = useState(false);
  let [clickedDown, setClickedDown] = useState(false);
  let [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );

  useEffect(() => {
    setDownVote(recc.Down_vote);
  }, []);
  useEffect(() => {
    setUpVote(recc.Up_vote);
  }, []);

  function handleClick(type, reccIsbn, username) {
    if (isAdmin) return;
    if ("downvote" == type) {
      let value = clickedDown ? -1 : 1;
      setDownVote((prevCount) => prevCount + value);
      let newDown = !clickedDown;
      setClickedDown(newDown);

      async function sendDownvote() {
        axios
          .put(
            "http://localhost:8800/users/" +
              username +
              "/book/" +
              isbn +
              "/recommendation/" +
              reccIsbn +
              "/downvote",
            {
              downvote: value,
            }
          )
          .catch((error) => {
            console.log(error);
          });
      }
      sendDownvote();
    } else {
      let value = clickedUp ? -1 : 1;
      setUpVote((prevCount) => prevCount + value);
      let newUp = !clickedUp;
      setClickedUp(newUp);
      //send update to server
      async function sendUpvote() {
        axios
          .put(
            "http://localhost:8800/users/" +
              username +
              "/book/" +
              isbn +
              "/recommendation/" +
              reccIsbn +
              "/upvote",
            {
              upvote: value,
            }
          )
          .catch((error) => {
            console.log(error);
          });
      }
      sendUpvote();
    }
  }

  return (
    <li className={styles.card}>
      <section className={styles.content}>
        <header>
          <Link
            className={styles.noDecor}
            to={"../book/" + recc.Recommended_isbn}
          >
            <h4 className={styles.h4 + " secondary"}>{recc.Title}</h4>
            <h4 className={styles.h4 + " secondary"}>
              {recc.Fname + " " + recc.Lname}
            </h4>
          </Link>
        </header>

        <ul className={styles.ul} aria-label="Tags for the Recommended Book">
          {recc.Tag.map((tag, index) => {
            // eslint-disable-next-line react/prop-types
            return (
              <li
                className={
                  (index % 2 == 0 ? "primary-bg " : "secondary-bg ") +
                  styles.bubble
                }
                key={tag + "-" + recc.Recommended_isbn + "-" + recc.Username}
              >
                {tag}
              </li>
            );
          })}
        </ul>
        <p>{recc.Comment}</p>
      </section>
      <div className={styles.cardFooter}>
        <span>Username : {recc.Username}</span>
        <div id={styles.holdRatings}>
          <span aria-label="Upvotes" className={styles.holdThumb}>
            <span>{upVote}</span>
            <button
              onClick={() => {
                handleClick("upvote", recc.Recommended_isbn, recc.Username);
              }}
            >
              <img
                alt="Green Thumbs up"
                className={styles.icon}
                src={thumbsUp}
              ></img>
            </button>
          </span>
          <span aria-label="Downvote" className={styles.holdThumb}>
            <span>{downVote}</span>
            <button
              onClick={() => {
                handleClick("downvote", recc.Recommended_isbn, recc.Username);
              }}
            >
              <img
                alt="Red Thumbs down"
                className={styles.icon}
                src={thumbsDown}
              ></img>
            </button>
          </span>
        </div>
      </div>
    </li>
  );
}

RecommendedCard.propTypes = {
  recc: PropTypes.shape({
    Book_isbn: PropTypes.string.isRequired,
    Recommended_isbn: PropTypes.string.isRequired,
    Comment: PropTypes.string.isRequired,
    Up_vote: PropTypes.number.isRequired,
    Down_vote: PropTypes.number.isRequired,
    Username: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Fname: PropTypes.string.isRequired,
    Lname: PropTypes.string.isRequired,
    Tag: PropTypes.arrayOf(PropTypes.string),
  }),
};
