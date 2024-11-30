import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import axios from "axios";
import Alert from "./Alert.jsx";

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
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios
        .get("http://localhost:8800/tag")
        .then((result) => {
          if (isMounted) {
            console.log(result.data);
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
    console.log(data);
    async function sendData() {
      let username = "novelguy";
      let temp_isbn = "9780553103540";
      axios
        .post(
          "http://localhost:8800/users/" +
            username +
            "/book/" +
            data.book_isbn +
            "/recommendation/" +
            // data.recommended_isbn
            temp_isbn,
          { comment: data.comment, tags: data.checkbox }
        )
        .then(() => {
          setAlert({ type: "success", message: "Submission successful!" });
        })
        .catch((error) => {
          setAlert({ type: "error", message: error.message });
          console.log(error);
        });
    }
    sendData();
  };

  //when search option is clicked, recc_isbn is set, will use when search component is done lol
  //also add nothing selected in recommendatioM!!!
  // async function onClick(recommended_isbn) {
  //   methods.setValue("recommended_isbn", recommended_isbn);
  // }

  return (
    <FormProvider {...methods}>
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
        <div className="secondary">Temporary Search Section</div>

        <div>
          <h3>You Selected</h3>
          <span className={styles.title}>Title</span>
          <span>Series Name</span>
          <div>Author</div>
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

        {tags == [] ? (
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
  );
}
