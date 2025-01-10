import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import check from "../assets/Check.svg";

//Any forms that implement it must use react-hook-form (this made it easy to make sure that at least one item is selected)
//Template form is at the bottom of the file.

function ToggleGroup({ selected, notSelected, itemName, id }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  function atLeastOneChecked(checkboxes) {
    console.log(checkboxes);
    console.log("checkbox" + id);
    return checkboxes.length > 0;
  }

  return (
    <fieldset className={"toggleGroup"}>
      <legend>Select Your {itemName}</legend>
      {selected.map((item, index) => {
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
                defaultChecked={true}
                {...register("checkbox" + { id }, {
                  validate: atLeastOneChecked,
                })}
              ></input>
            ) : (
              <input
                type="checkbox"
                id={"input-" + item}
                name="toggleGroup"
                value={item}
                defaultChecked={true}
                {...register("checkbox" + id)}
              ></input>
            )}

            <span
              className={"center"}
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
      {notSelected.map((item, index) => {
        return (
          <label
            htmlFor={"input-" + item}
            aria-labelledby={"span-" + item}
            key={item}
          >
            {index == 0 && selected.length == 0 ? (
              <input
                type="checkbox"
                id={"input-" + item}
                name="toggleGroup"
                value={item}
                {...register("checkbox" + id, {
                  validate: atLeastOneChecked,
                })}
              ></input>
            ) : (
              <input
                type="checkbox"
                id={"input-" + item}
                name="toggleGroup"
                value={item}
                {...register("checkbox" + { id })}
              ></input>
            )}

            <span
              className={"center"}
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
      {errors["checkbox" + id] && (
        <div className="error">You must select at least one item.</div>
      )}
    </fieldset>
  );
}

// selected - selected items
// notSelected - not selected items
// itemName is the name of the toggle group. like Tags, or Genres .

ToggleGroup.defaultProps = {
  selected: [],
  notSelected: [],
  id: "",
};

ToggleGroup.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  notSelected: PropTypes.arrayOf(PropTypes.string),
  itemName: PropTypes.string,
  id: PropTypes.string,
};

export default ToggleGroup;

/**

import { useForm, FormProvider} from "react-hook-form";

export default function DummyForm() {
  const methods = useForm();

  const onSubmit = (data) => {
    //whatever you do with form data 
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ToggleGroup selected={items} itemName={"ToggleGroupName"}></ToggleGroup>
          <input type="submit"></input>
      </form>
    </FormProvider>
  );
}

 */
