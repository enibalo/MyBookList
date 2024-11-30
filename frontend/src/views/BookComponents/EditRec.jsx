import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import PropTypes from "prop-types";
import axios from "axios";

export default function EditRec() {
  let { isbn } = useParams();
  let [reccs, setReccs] = useState([]);
  let [error, setError] = useState(false);
  let username = "novelguy";

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios
        .get(
          "http://localhost:8800/users/" +
            username +
            "/book/" +
            isbn +
            "/recommendation"
        )
        .then((result) => {
          if (isMounted) {
            console.log(result.data);
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

  if (error) return <div>Error</div>;

  if (reccs == []) return <div>Loading</div>;

  return (
    <>
      {reccs.map((recc, index) => {
        return (
          <EditForm
            key={recc.isbn + "-" + index}
            isbn={isbn}
            recc={recc}
          ></EditForm>
        );
      })}
    </>
  );
}

function EditForm({ isbn, recc }) {
  const methods = useForm({
    defaultValues: {
      comment: recc.Comment,
      book_isbn: isbn,
      recommended_isbn: recc.Recommended_isbn,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    async function sendData() {
      let username = "novelguy";
      axios
        .put(
          "http://localhost:8800/users/" +
            username +
            "/book/" +
            data.book_isbn +
            "/recommendation/" +
            data.recommended_isbn,
          { comment: data.comment, tags: data.checkbox }
        )
        .then(() => {
          console.log("Sucess!");
        })
        .catch((error) => {
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
            <span className={styles.title}>Title: {recc.Title}</span>
            <div>
              Author: {recc.Fname} {recc.Lname}
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
          <span>{methods.formState.errors.comment.message}</span>
        )}
        <input type="submit" className="primary-bg" value="Submit"></input>
      </form>
      <hr className={styles.dividor}></hr>
    </FormProvider>
  );
}

EditForm.propTypes = {
  isbn: PropTypes.string.isRequired,
  recc: PropTypes.shape({
    Recommended_isbn: PropTypes.string.isRequired,
    Comment: PropTypes.string.isRequired,
    Selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    NotSelected: PropTypes.arrayOf(PropTypes.string.isRequired),
    Title: PropTypes.string.isRequired,
    Fname: PropTypes.string.isRequired,
    Lname: PropTypes.string.isRequired,
  }).isRequired,
};

export { EditForm };
