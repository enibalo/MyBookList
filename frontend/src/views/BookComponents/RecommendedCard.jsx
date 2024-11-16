import { useState } from "react";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import thumbsUp from '../../assets/Thumbs-up.svg';
import thumbsDown from '../../assets/Thumbs-down.svg';
import styles from '../../styles/Book.module.css';

export default function RecommendedCard({recc}){
    let [tags, setTags] = useState([]);
    let [error, setError] = useState(false);
    console.log("card");
    
    useEffect( () => {
        let isMounted = true; 
        fetchReccTags(recc.Book_isbn,recc.Username, recc.Recommended_isbn)
        .then( result => {  if (isMounted) setTags(result)})
        .catch((error) => {console.log("error"); setError(true)});

        return () => { isMounted = false};
    }, []);

  
    return(
        <li className={styles.card}>
            <section className={styles.content}>
                <header>
                    <Link className={styles.noDecor} to={"../book/" + recc.Recommended_isbn}>
                    <h4 className={styles.h4 + " secondary"}>{recc.Title}</h4>
                    <h4 className={styles.h4 + " secondary"} >{recc.Fname +" " + recc.Lname}</h4>
                    </Link>
                </header>
  
                <ul className={styles.ul} aria-label="Tags for the Recommended Book">
                        {
                        ( tags== []) ?  ( error ? <div>Error</div>: <div>Loading...</div>) : tags.map( (tag, index) => {
                            // eslint-disable-next-line react/prop-types
                            return <li className={ (index % 2 == 0 ? "black-bg " : "red-bg ")  +  styles.bubble} key={tag.Tag_name + "-" + recc.Recommended_isbn} >{tag.Tag_name}</li> ;
                        })
                        }
                </ul>
                <p>{recc.Comment}</p>
            </section>
            <div className={styles.cardFooter}>
                <span>Username : {recc.Username}</span>
                <div id={styles.holdRatings}>
                    <span aria-label='Upvotes for this Recommendation' className={styles.holdThumb}>
                        <span>{recc.Up_vote}</span>
                        <div><img alt='Green Thumbs up' className={styles.icon} src={thumbsUp}></img></div>
                    </span>
                    <span aria-label='Downvote for this Recommendation'className={styles.holdThumb}>
                        <span>{recc.Down_vote}</span>
                        <div><img  alt='Red Thumbs down'className={styles.icon } src={thumbsDown}></img></div>
                    </span>
                </div>
            </div>
        </li>
    );
  }
  
 
async function fetchReccTags(bookIsbn, username, reccIsbn){
    const tags = [
        {"Tag_name" : "Tag1"},
        {"Tag_name" : "Tag2"}
    ]
    return tags;
  }
  
  
  
  
  
  
  
  
  