import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import check from "../../assets/Check.svg";

export default function AddRec() {
  const methods = useForm({
    defaultValues: {
      comment:
        "This book has the same tropes, and it&#39;s really well written!",
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
      isMounted = false; // Cleanup flag on unmount
    };
  }, []);

  const onSubmit = (data) => {
    console.log(data, isbn);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={styles.form}>
        <div className="secondary">Temporary Search Section</div>
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

async function fetchTags() {
  let tags = ["fun", "cool", "awesome"];
  return tags;
}

export function ToggleGroup({ items, itemName }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  function atLeastOneChecked(checkboxes) {
    return checkboxes.length > 0;
  }

  return (
    <fieldset className={"toggleGroup"}>
      <legend>Select Your {itemName}</legend>
      {items.map((item, index) => {
        return (
          <label
            htmlFor={"input-" + item}
            aria-labelledby={"span-" + item}
            key={item}
          >
            {index == 0 ? (
              <input
                type="checkbox"
                id={"input-" + item}
                name="toggleGroup"
                value={item}
                {...register("checkbox", {
                  validate: atLeastOneChecked,
                })}
              ></input>
            ) : (
              <input
                type="checkbox"
                id={"input-" + item}
                name="toggleGroup"
                value={item}
                {...register("checkbox")}
              ></input>
            )}

            <span
              className={styles.center}
              aria-hidden="true"
              tabIndex="-1"
              id={"span-" + item}
            >
              <img src={check}></img>
              <div className="inner-text">{item}</div>
            </span>
          </label>
        );
      })}
      {errors.checkbox && (
        <div className="error">You must select at least one item.</div>
      )}
    </fieldset>
  );
}

ToggleGroup.propTypes = {
  items: PropTypes.array,
  itemName: PropTypes.string,
};

/*

  <label for="work_day_sun" aria-labelledby="sun">
    <input type="checkbox" id="work_day_sun" name="work_days" value="1" {...register("chechbox", {
     validate: atLeastOneChecked,
  })}> 
    <span aria-hidden="true" tabIndex="-1" id="sun">Sunday</span>
  </label>

  //all should be registered as same name, validate only needed on one of them 

  function atLeastOneMediumChecked(selectedMediums: string[]) {
  return selectedMediums.length > 0;
}

{errors.medium && (
  <span>
    At least one medium selection is required
  </span>
)}

<label><input type="checkbox" name="work_days" value="1"><span>sun</span></label>
  <label><input type="checkbox" name="work_days" value="2"><span>mon</span></label>
  <label><input type="checkbox" name="work_days" value="3"><span>tue</span></label>
  <label><input type="checkbox" name="work_days" value="4"><span>wed</span></label>
  <label><input type="checkbox" name="work_days" value="5"><span>thu</span></label>
  <label><input type="checkbox" name="work_days" value="6"><span>fri</span></label>

  #id_work_days input[type="checkbox"] {
  display: none;
}

#id_work_days span {
  display: inline-block;
  padding: 10px;
  text-transform: uppercase;
  border: 2px solid gold;
  border-radius: 3px;
  color: gold;
}

#id_work_days input[type="checkbox"]:checked + span {
  background-color: gold;
  color: black;
}
*/
