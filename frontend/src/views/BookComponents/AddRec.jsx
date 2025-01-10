import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import axios from "axios";
import Search from "./Search.jsx";

export default function AddRec() {
  const methods = useForm({
    defaultValues: {
      comment: ``,
      recommended_isbn: "",
    },
  });

  const { isbn } = useParams();
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(false);
  const [reccAuthor, setReccAuthor] = useState("");
  const [reccTitle, setReccTitle] = useState("");

  let [username, setUsername] = useState(localStorage.getItem("username"));
  let [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );

  useEffect(() => {
    let isMounted = true;
    if (isAdmin) return;
    async function fetchData() {
      axios
        .get("http://localhost:8800/tag")
        .then((result) => {
          if (isMounted) {
            setTags(result.data);
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

  const onSubmit = (data) => {
    async function sendData() {
      axios
        .post(
          "http://localhost:8800/users/" +
            username +
            "/book/" +
            data.book_isbn +
            "/recommendation/" +
            data.recommended_isbn,
          { comment: data.comment, tags: data.checkbox }
        )
        .then(() => {
          alert("Submission successful!");
        })
        .catch((error) => {
          alert(error.message);
          console.log(error);
        });
    }
    sendData();
  };

  function handleClick(book) {
    methods.setValue("recommended_isbn", book.ISBN);
    setReccTitle(book.Title);
    setReccAuthor(book.AuthorName);
    window.scrollTo(0, document.body.scrollHeight);
  }

  if (isAdmin == true) {
    return (
      <div className="secondary" id={styles.noReccs}>
        Only users can add a recommendation!
      </div>
    );
  }

  return (
    <>
      <Search handleClick={handleClick}></Search>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
          <div>
            <h3>You Selected</h3>
            <span className={styles.title}>Title: {reccTitle}</span>
            <div>Author: {reccAuthor}</div>
          </div>
          <input
            type="hidden"
            name="book_isbn"
            {...methods.register("book_isbn", { value: isbn })}
          ></input>
          <input
            type="hidden"
            name="recommended_isbn"
            {...methods.register("recommended_isbn", {
              required: "You must select a book to recommend.",
            })}
          ></input>
          {methods.formState.errors.recommended_isbn && (
            <div className={"error " + styles.error}>
              {methods.formState.errors.recommended_isbn.message}
            </div>
          )}

          {tags.length == 0 ? (
            error ? (
              <div>Error</div>
            ) : (
              <div>Loading...</div>
            )
          ) : (
            <ToggleGroup notSelected={tags} itemName={"Tags"}></ToggleGroup>
          )}

          <textarea
            className={styles.textarea}
            {...methods.register("comment", {
              required: "This field is required.",
              minLength: {
                value: 15,
                message: "The comment must contain at least 15 characters.",
              },
              maxLength: {
                value: 200,
                message: "The comment must contain less than 200 characters.",
              },
            })}
          ></textarea>
          {methods.formState.errors.comment && (
            <div className={"error " + styles.error}>
              {methods.formState.errors.comment.message}
            </div>
          )}
          <input
            type="submit"
            className={"primary-bg " + styles.form_submit}
            value="Submit"
          ></input>
        </form>
      </FormProvider>
    </>
  );
}
