import coffeeLogo from "../assets/Coffee.svg";

import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Header() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));

  return (
    <header className={styles.header}>
      <img className={styles.img} aria-hidden="true" src={coffeeLogo}></img>
      <nav>
        <HeaderLinks isAdmin={isAdmin}></HeaderLinks>
      </nav>
    </header>
  );
}

export function HeaderLinks({ isAdmin }) {
  if (isAdmin == null) {
    return null;
  } else if (isAdmin == "false") {
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
          <Link className={styles.noDecor} to={"../adminSettings"}>
            {" "}
            Admin
          </Link>
        </li>
      </ul>
    );
  }
}

HeaderLinks.propTypes = {
  isAdmin: PropTypes.string.isRequired,
};

export default Header;
