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
  let username = "";

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      axios.get("http://localhost:8800/users/" + username + "/book/" + isbn + "/recommendation")
      .then((result)=>{
        if (isMounted) {
          console.log(result.data);
          setReccs(result.data);
        }
      })
      .catch((error)=>{
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
    async function sendData(){
      let username = "";
      axios.post("/users/"  + username + "/book/" + isbn +  "/recommendation/" + data.recommended_isbn + "/downvote", {data : data } )
      .catch(error => {console.log(error)});
    }
    sendData();
  };

  //for when search component is added
  // function onClick(recommended_isbn) {
  //   methods.setValue("recommended_isbn", recommended_isbn);
  // }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
        <div className="secondary">Temporary Search Section</div>

        <div aria-label="Information of the selected book.">
          <h3>You Selected:</h3>
          <div>
            <span className={styles.title}>Title</span>
            <span>Series Name</span>
            <div>Author</div>
          </div>
        </div>

        <input
          type="hidden"
          name="username"
          {...methods.register("username", { value: "username" })}
        ></input>
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
        <input type="submit" className="primary-bg"></input>
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
    Selected : PropTypes.arrayOf(PropTypes.string).isRequired,
    NotSelected : PropTypes.arrayOf(PropTypes.string.isRequired)

  }).isRequired,
};


export { EditForm };