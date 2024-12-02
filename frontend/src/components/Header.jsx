import coffeeLogo from "../assets/Coffee.svg";

import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

function Header() {
  const [username, setUsername] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("currentUsername"));
    setType(localStorage.getItem("type"));
  }, []);

  return (
    <header className={styles.header}>
      <img className={styles.img} aria-hidden="true" src={coffeeLogo}></img>

      <nav>
        <HeaderLinks username={username} type={type}></HeaderLinks>
      </nav>
    </header>
  );
}

export function HeaderLinks(username, type) {
  if (username == "") {
    return null;
  } else {
    if (type == "user") {
      return (
        <ul className={styles.ul}>
          <li>
            {" "}
            <Link className={styles.noDecor} to={"../browse"}>
              {" "}
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
            </Link>
          </li>
          <li>
            {" "}
            <Link className={styles.noDecor} to={"../browse"}>
              {" "}
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
