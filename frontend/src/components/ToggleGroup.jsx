import styles from "../../styles/Book.module.css";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import check from "../../assets/Check.svg";

// not done styling it!!
//Also, any forms that implement it must use react-hook-form ( made it easy to make sure that at least one item is selected)
export default function ToggleGroup({ items, itemName }) {
  console.log(items);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  function atLeastOneChecked(checkboxes) {
    return checkboxes.length > 0;
  }

  return (
    <fieldset className="toggleGroup">
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

            <span aria-hidden="true" tabIndex="-1" id={"span-" + item}>
              <img src={check}></img>
              {item}
            </span>
          </label>
        );
      })}
      {errors.checkbox && <span>You must select at least one item.</span>}
    </fieldset>
  );
}

ToggleGroup.propTypes = {
  items: PropTypes.array,
  itemName: PropTypes.string,
};
