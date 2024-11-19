import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/Book.module.css";
import { useForm } from "react-hook=form";

export default function AddRec() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  let { isbn } = useParams();
  let [error, setError] = useState(false);
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Select Your Tags</legend>
      </fieldset>
      <textarea
        placeholder="This book has the same tropes, and it&#39;s really well written!"
        {...register("comment", {
          required: "This field is required.",
          maxLength: {
            value: 200,
            message: "The comment must contain less than 200 characters.",
          },
        })}
      ></textarea>
      {errors.comment && <span>{errors.comment.message}</span>}
      <input type="submit"></input>
    </form>
  );
}

async function getTags() {
  let tags = ["fun", "cool"];
  return tags;
}

export function ToggleGroup({ items, itemName }) {
  return (
    <fieldset>
      <legend>Select Your {itemName}</legend>
    </fieldset>
  );
}

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
