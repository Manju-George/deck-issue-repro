import * as React from 'react';
import "../../App.css"
import { useCallback } from 'react';


interface radioGroupProps {
    name: string;
    options: string[];
    selected: string
    handleSelected: (_: boolean, id: string) => void;
}

const RadioGroup = ( { name,options,  handleSelected, selected }: radioGroupProps ) => {
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSelected(event.target.checked, event.target.value);
        },
        [handleSelected]
    );

    const radioOptions = options.map((option) => (
        <div key={option}>
            <input
                type="radio"
                name={name}
                value={option}
                checked={selected === option}
                onChange={handleChange}
            />
            <label>{option}</label>
        </div>
    ));

  return (
        <div >
            <h3>LGA</h3>

            {radioOptions}

      <p>
        Select LGA to view data
      </p>
        </div>
    );
}

export default RadioGroup