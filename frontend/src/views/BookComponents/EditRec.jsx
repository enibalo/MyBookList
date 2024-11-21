import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider } from "react-hook-form";
import ToggleGroup from "../../components/ToggleGroup.jsx";

export default function EditRec() {
  const methods = useForm({
    defaultValues: {
      comment: `This book has the same tropes, and it's really well written!`,
    },
  });

  let { isbn } = useParams();
  let [tags, setTags] = useState([]);
  let [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchTags()
      .then((result) => {
        if (isMounted) {
          setTags(result);
        }
      })
      .catch(() => {
        setError(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = (data) => {
    console.log(data, isbn);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
        <div className="secondary">Temporary Search Section</div>

        <div aria-label="Information of the selected book.">
          <h3>You Selected:</h3>
          <div>
            <h3>You Selected</h3>
            <span>Title</span>
            <span>Series Name</span>
            <div>Author</div>
          </div>
        </div>

        {tags == [] ? (
          error ? (
            <div>Error</div>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <ToggleGroup items={tags} itemName={"Tags"}></ToggleGroup>
        )}
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
    </FormProvider>
  );
}

async function fetchReccs(isbn, username) {}

async function fetchTags() {
  let tags = ["fun", "cool", "awesome"];
  return tags;
}

//handle populating form, and tags especially
// need username, isbn, recommended_isbn, and comment and tags!!
//use values in react-hook-form for default population
