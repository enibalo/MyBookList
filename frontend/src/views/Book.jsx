/* eslint-disable react/prop-types */

import Header from '../components/Header.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import starIcon from '../assets/Star.svg';
import thumbsUp from '../assets/Thumbs-up.svg';
import thumbsDown from '../assets/Thumbs-down.svg'
import styles from '../styles/Book.module.css';
import PropTypes from 'prop-types';


function Book (){
    let {isbn} = useParams();

    let [book, setBook] = useState(null);
    let [genres, setGenres] = useState([]);
    let [reccs, setReccs] = useState([]);

    useEffect(  ()=> {
        async function fetchData(){
            const tempBook = await fetchBook(isbn);
            setBook(tempBook);

            const tempGenres = await fetchGenres(isbn);
            setGenres(tempGenres);

            const tempReccs = await fetchReccs(isbn);
            setReccs(tempReccs);
        }
        fetchData();
    });

    return(
        
        <>
        <Header></Header>
        <main id={styles.main}>
            <div id={styles.squeeze}>
            <section id={styles.book} className={styles.container}> 
                <div className={styles.holdIcon}>
                    <img alt='Empty Star' aria-label="Not a favorite of the Admin" className={styles.icon} src={starIcon}></img>
                </div>
                {book != null &&
                <>
                <div className={styles.content}>
                <header className={styles.header}>
                    <h3>{book.Title}</h3> 
                    {book.Series_name != null && <h3>{book.Series_name}</h3>}
                    <h4 className={"secondary " + styles.h4}>{book.Fname + " " + book.Lname}, {book.Publisher_name}</h4>
                </header>
                <ul className={styles.ul} aria-label="Genres of this Book">
                    {genres.map( (genre) => {
                        return <li className={"black-bg " +  styles.bubble} key={genre.Genre_name}>{genre.Genre_name}</li> ;
                    })}
                </ul>
                <p>
                    {book.Summary}
                </p>
            </div>
            <a className="secondary" href={book.Purchase_link} aria-label="Purchase link which takes you to the Amazon purchase page.">Purchase Link</a>
            </>
            }
            </section>
            <section className={styles.container}>
                <div id={styles.reccomendHeader}>
                <h2>Recommendations</h2>  
                <Menu></Menu>
                </div>
                {reccs == [] ? 
                    <div className="secondary">Be the first to recommend a book!</div> 
                    : 
                    <ul>
                        {reccs.map( (recc) => {
                            return <ReccomendedCard key={recc.Username+"-"+recc.Recommended_isbn} recc={recc}></ReccomendedCard>;
                        })
                        }
                    </ul>
                }
            </section>
            </div>
        </main>
        </>
    );
}


//two states, no reccs, has reccs, 
//accordion drop down menu
//center thumbs up area
//fix recommendatins heading spacing 
//need to handle favorited by the admin!
//check readability of font/


export function ReccomendedCard({recc}){
    let [tags, setTags] = useState([]);
    
    useEffect( () => {
    
        async function fetchData(){
            const tempTags = await fetchReccTags(recc.Book_isbn,recc.Username, recc.Recommended_isbn);
            setTags(tempTags);
        }
        fetchData();
    }
    );

    return(
        <li className={styles.card}>
            <section className={styles.content}>
                <header>
                    <h4 className={styles.h4 + " secondary"}>{recc.Title}</h4>
                    <h4 className={styles.h4 + " secondary"} >{recc.Fname +" " + recc.Lname}</h4>
                </header>

                <ul className={styles.ul} aria-label="Tags for the Recommended Book">
                        {tags.map( (tag, index) => {
                            // eslint-disable-next-line react/prop-types
                            return <li className={ (index % 2 == 0 ? "black-bg " : "red-bg ")  +  styles.bubble} key={tag.Tag_name + "-" + recc.Recommended_isbn} >{tag.Tag_name}</li> ;
                        })
                        }
                </ul>
                <p>{recc.Comment}</p>
            </section>
            <div className={styles.cardFooter}>
                <span>Username : {recc.Username}</span>
                <div>
                <div aria-label='Upvotes for this Recommendation' className={styles.holdThumb}>
                    <span>{recc.Up_vote}</span>
                    <div><img alt='Green Thumbs up' className={styles.icon} src={thumbsUp}></img></div>
                </div>
                <div aria-label='Downvote for this Recommendation'className={styles.holdThumb}>
                    <span>{recc.Down_vote}</span>
                    <div><img  alt='Red Thumbs down'className={styles.icon } src={thumbsDown}></img></div>
                </div>
                </div>
            </div>
        </li>
    );
}


export function Menu(){
    const menuItems = ["Default", "Add Recommendation", "Edit Recommendation", "Filter Recommendation"];
    const menuLinks = ["default", "add", "edit", "filter", "default"];
    function redirectLink(e){
        let val = e.target.value;
        console.log(val);
    }
    return (
        <>
        <label htmlFor={styles.menu} aria-label="Choose a Way to Interact With the Recommendation Section"></label>
        <select onChange={redirectLink} id={styles.menu} className="black-bg" >
            {menuItems.map((item, index) =>{
                return (<option value={menuLinks[index]} key={menuLinks[index]} className="black-bg">{item}</option>);
            }
            )}
        </select>
        </>
    );

}


async function fetchReccs(isbn){
    const reccs = [
        {
        "Book_isbn": 1,
          "Recommended_isbn": 2,
          "Comment": "This book offers great insights!",
          "Up_vote": 10,
          "Down_vote": 1,
          "Username": "reader123",
          "Title": "Recommended Book Title",
          "Fname": "Alice",
          "Lname": "Smith"
        },
        {
          "Book_isbn": 1,
          "Recommended_isbn": 3,
          "Comment": "Explanation: Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.",
          "Up_vote": 7,
          "Down_vote": 0,
          "Username": "booklover89",
          "Title": "Another Recommended Book",
          "Fname": "Bob",
          "Lname": "Johnson"
        }
      ];
    return reccs;
}


async function fetchGenres(isbn){
    const genres = [
        {"Genre_name" : "Genre1"},
        {"Genre_name" : "Genre2"}
    ]
    return genres;
}

async function fetchReccTags(bookIsbn, username, reccIsbn){
    const tags = [
        {"Tag_name" : "Tag1"},
        {"Tag_name" : "Tag2"}
    ]
    return tags;
}

async function  fetchBook(isbn){   
    let book = [
        {
          "ISBN": 1,
          "Title": "Sample Book Title",
          "Purchase_link": "https://example.com/purchase-link",
          "Fname": "John",
          "Lname": "Doe",
          "Publisher_name": "Sample Publisher",
          "Summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod turpis eu malesuada condimentum. Curabitur magna sem, bibendum sit amet nibh et, interdum egestas arcu. Proin nulla nunc, viverra quis lectus vel, aliquet pharetra arcu. Duis sodales tellus id tellus accumsan pretium at non diam. Cras in interdum sem, a elementum dolor. Nullam hendrerit rhoncus nunc et mollis. Maecenas laoreet at justo at gravida. Suspendisse vitae risus sem. Pellentesque vulputate, ligula et placerat facilisis, ipsum dui pulvinar ex, vitae sagittis est tellus ut tortor. Maecenas id nisi eu lorem venenatis finibus eu lacinia erat. Phasellus tellus justo, sagittis nec nisl at, tempus porta dolor. Integer non ex tristique, interdum metus et, rhoncus diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus tempor tellus non nisi placerat consectetur. Nunc eget sollicitudin ligula.",
          "Series_name" : "Sample Series Name"
        }
      ];

    
    return book[0];
}


/*
<select id="linkSelect" onchange="redirectToLink()">
  <option value="">Select an option...</option>
  <option value="https://example.com/page1">Go to Page 1</option>
  <option value="https://example.com/page2">Go to Page 2</option>
  <option value="https://example.com/page3">Go to Page 3</option>
</select>
 */



export default Book;


