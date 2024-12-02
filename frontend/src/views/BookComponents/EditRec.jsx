import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import Alert from "./Alert.jsx";

export default function EditRec() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("currentUsername"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, []);

  let { isbn } = useParams();
  let [reccs, setReccs] = useState([]);
  let [error, setError] = useState(false);

  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;
    if (isAdmin) return;
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

  if (isAdmin == true) {
    return (
      <div className="secondary" id={styles.noReccs}>
        Only users can edit a recommendation!
      </div>
    );
  }

  if (error) return <div>Error</div>;

  if (reccs == []) return <div>Loading</div>;

  return (
    <>
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      {reccs.map((recc, index) => {
        return (
          <EditForm
            key={recc.isbn + "-" + index}
            isbn={isbn}
            recc={recc}
            setAlert={setAlert}
            username={username}
          ></EditForm>
        );
      })}
    </>
  );
}

function EditForm({ isbn, recc, setAlert, username }) {
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
          setAlert({ type: "success", message: "Submission successful!" });
          console.log("Sucess!");
        })
        .catch((error) => {
          setAlert({ type: "error", message: error.message });
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
  setAlert: PropTypes.func.isRequired,
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
