import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import PropTypes from "prop-types";
import axios from "axios";

export default function EditRec() {
  let [username, setUsername] = useState(localStorage.getItem("username"));
  let [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );

  let { isbn } = useParams();
  let [reccs, setReccs] = useState(null);
  let [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isAdmin) return;
    async function fetchData() {
      axios
        .get(
          "http://localhost:8800/users/" +
            username +
            "/books/" +
            isbn +
            "/recommendations"
        )
        .then((result) => {
          if (isMounted) {
            setReccs(result.data);
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

  if (isAdmin == true) {
    return (
      <div className="secondary" id={styles.noReccs}>
        Only users can edit a recommendation!
      </div>
    );
  }

  if (error)
    return (
      <div className="secondary" id={styles.noReccs}>
        Error
      </div>
    );

  if (reccs == null)
    return (
      <div className="secondary" id={styles.noReccs}>
        Loading...
      </div>
    );

  if (reccs.length == 0)
    return (
      <div className="secondary" id={styles.noReccs}>
        You have made no recommendations for this book.
      </div>
    );

  return (
    <>
      {reccs.map((recc, index) => {
        return (
          <EditForm
            key={recc.isbn + "-" + index}
            isbn={isbn}
            recc={recc}
            username={username}
            toggle_id={index}
          ></EditForm>
        );
      })}
    </>
  );
}

function EditForm({ isbn, recc, username, toggle_id }) {
  const methods = useForm({
    defaultValues: {
      comment: recc.Comment,
      book_isbn: isbn,
      recommended_isbn: recc.Recommended_isbn,
    },
  });

  const onSubmit = (data) => {
    async function sendData() {
      axios
        .put(
          "http://localhost:8800/users/" +
            username +
            "/books/" +
            data.book_isbn +
            "/recommendations/" +
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
        <div aria-label="Information for the selected book.">
          <h3>You Selected</h3>
          <div>
            <span className={styles.title}>{recc.Title}</span>
            <div>
              By {recc.Fname} {recc.Lname}
            </div>
          </div>
        </div>
        <input
          type="hidden"
          name="book_isbn"
          {...methods.register("book_isbn")}
        ></input>
        <input
          type="hidden"
          name="recommended_isbn"
          {...methods.register("recommended_isbn")}
        ></input>

        <ToggleGroup
          id={toggle_id}
          selected={recc.Selected}
          notSelected={recc.NotSelected}
          itemName={"Tags"}
        ></ToggleGroup>

        <textarea
          className={styles.textarea}
          {...methods.register("comment", {
            required: "This field is required.",
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
      <hr className={styles.dividor}></hr>
    </FormProvider>
  );
}

EditForm.propTypes = {
  isbn: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  recc: PropTypes.shape({
    Recommended_isbn: PropTypes.string.isRequired,
    Comment: PropTypes.string.isRequired,
    Selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    NotSelected: PropTypes.arrayOf(PropTypes.string.isRequired),
    Title: PropTypes.string.isRequired,
    Fname: PropTypes.string.isRequired,
    Lname: PropTypes.string.isRequired,
  }).isRequired,
  toggle_id: PropTypes.number.isRequired,
};

export { EditForm };
