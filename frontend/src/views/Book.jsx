/* eslint-disable react/prop-types */

import Header from '../components/Header.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import starIcon from '../assets/Star.svg';
import fullStarIcon from '../assets/Filled-Star.svg'
import styles from '../styles/Book.module.css';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';


function Book (){
    let {isbn} = useParams();

    let [book, setBook] = useState(null);
    let [genres, setGenres] = useState([]);

    useEffect(  ()=> {
        async function fetchData(){
            const tempBook = await fetchBook(isbn);
            setBook(tempBook);

            const tempGenres = await fetchGenres(isbn);
            setGenres(tempGenres);
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
                    {
                    book != null && book.Username != null ? 
                        <img alt='Filled Star' aria-label="Is a Favorite of the Admin" className={styles.icon} src={fullStarIcon}></img>
                        :
                        <img alt='Empty Star' aria-label="Not a favorite of the Admin" className={styles.icon} src={starIcon}></img>
                    }

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
                <header id={styles.reccomendHeader}>
                <h2>Recommendations</h2>  
                <Menu></Menu>
                </header>
                <Outlet></Outlet>
            </section>
            </div>
        </main>
        </>
    );
}

//accordion drop down menu
//link to page of book when hover on title.


export function Menu(){
    let navigate = useNavigate();
    const menuItems = ["Default", "Add Recommendation", "Edit Recommendation", "Filter Recommendation"];
    const menuLinks = ["default", "add", "edit", "filter", "default"];

    function redirectLink(e){
        console.log(e.target.value);
        navigate(e.target.value);
    }

    return (
        <>
        <label htmlFor={styles.menu} aria-label="Choose a Way to Interact With the Recommendation Section"></label>
        <select onChange={redirectLink} id={styles.menu} >
            {menuItems.map((item, index) =>{
                return (<option value={menuLinks[index]} key={menuLinks[index]} className="black-bg">{item}</option>);
            }
            )}
        </select>
        </>
    );

}



async function fetchGenres(isbn){
    const genres = [
        {"Genre_name" : "Genre1"},
        {"Genre_name" : "Genre2"}
    ]
    return genres;
}



async function  fetchBook(isbn){   
    let book = [
        {
          "ISBN": 1,
          "Title": "Sample Book Title",
          "Purchase_link": "https://example.com/purchase-link",
          "Fname": "John",
          "Username": "Admin",
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


