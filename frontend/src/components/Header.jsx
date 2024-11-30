import coffeeLogo from "../assets/Coffee.svg";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
//import { Link } from "react-router-dom";

function Header( props) {
  return (
    <header className={styles.header}>
      <img className={styles.img} aria-hidden="true" src={coffeeLogo}></img>

      <nav>
        <ul className={styles.ul}>
          <li>
            {" "}
            <Link
            className={styles.noDecor}
            to={"../" + props.secondPage}
          > {props.secondPage}</Link> 
          </li>
          <li>
          <Link
            className={styles.noDecor}
            to={"../settings"}
          > User</Link>
          </li>
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
