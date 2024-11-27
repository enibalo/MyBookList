import coffeeLogo from "../assets/Coffee.svg";
import PropTypes from "prop-types";

import styles from "../styles/Header.module.css";
//import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className={styles.header}>
      <img className={styles.img} aria-hidden="true" src={coffeeLogo}></img>

      <nav>
        <ul className={styles.ul}>
          <li>
            {" "}
            {props.secondPage == "Browse" ? props.secondPage : props.secondPage}
          </li>
          <li>User</li>
        </ul>
      </nav>
    </header>
  );
}


Header.propTypes = {
  secondPage: PropTypes.string,
};

Header.defaultProps = {
  secondPage: "Browse",
};

export default Header;
