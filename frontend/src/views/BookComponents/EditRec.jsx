import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";
import PropTypes from "prop-types";

export default function EditRec() {
  let { isbn } = useParams();
  let [reccs, setReccs] = useState([]);
  let [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchReccs()
      .then((result) => {
        if (isMounted) {
          setReccs(result);
        }
      })
      .catch(() => {
        setError(true);
      });
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

export function EditForm({ isbn, recc }) {
  const methods = useForm({
    defaultValues: {
      comment: recc.comment,
      book_isbn: isbn,
      recommended_isbn: recc.recommended_isbn,
    },
  });

  const onSubmit = (data) => {
    console.log(data, isbn);
  };

  async function onClick(recommended_isbn) {
    methods.setValue("recommended_isbn", recommended_isbn);
  }

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
          selected={recc.selected}
          notSelected={recc.notSelected}
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

EditForm.proptypes = {
  isbn: PropTypes.string.required,
  recc: PropTypes.shape.required,
};

async function fetchReccs(isbn, username) {
  let recommendation = [
    {
      book_isbn: "9781234567890",
      recommended_isbn: "9780987654321",
      comment: "Great follow-up for enthusiasts.",
      selected: ["bestseller", "science fiction", "award-winning"],
      notSelected: ["classic", "new release", "non-fiction"],
    },
    {
      book_isbn: "9781122334455",
      recommended_isbn: "9785566778899",
      comment: "Perfect for readers interested in historical fiction.",
      selected: ["historical fiction", "top rated"],
      notSelected: ["romance", "self-help", "new release"],
    },
  ];

  return recommendation;
}

// JSON_ARRAYAGG https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_json-arrayagg
// OR USE GROUP_CONCAT
// so use sql, to return one column GROUPCONCAT/JSONARRAY()
// JOIN Tags on Recommendation_tags does not equal Tags, then JOIN to Recommendation. So have two columns, selected and non selected.
