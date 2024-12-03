import coffeeLogo from "../assets/Coffee.svg";

import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

function Header() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("currentUsername"));
    setIsAdmin(localStorage.getItem("isAdmin"));
    console.log(isAdmin);
  }, []);

  return (
    <header className={styles.header}>
      <img className={styles.img} aria-hidden="true" src={coffeeLogo}></img>

      <nav>
        <HeaderLinks username={username} isAdmin={isAdmin}></HeaderLinks>
      </nav>
    </header>
  );
}

export function HeaderLinks(username, isAdmin) {
  if (username == "") {
    return null;
  } else {
    if (isAdmin == false) {
      return (
        <ul className={styles.ul}>
          <li>
            {" "}
            <Link className={styles.noDecor} to={"../browse"}>
              {" "}
              Browse
            </Link>
          </li>
          <li>
            <Link className={styles.noDecor} to={"../settings"}>
              {" "}
              User
            </Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className={styles.ul}>
          <li>
            {" "}
            <Link className={styles.noDecor} to={"../add-book"}>
              {" "}
              Add Book
            </Link>
          </li>
          <li>
            {" "}
            <Link className={styles.noDecor} to={"../browse"}>
              {" "}
              Browse
            </Link>
          </li>
          <li>
            <Link className={styles.noDecor} to={"../settings"}>
              {" "}
              User
            </Link>
          </li>
        </ul>
      );
    }
  }
}

export default Header;
