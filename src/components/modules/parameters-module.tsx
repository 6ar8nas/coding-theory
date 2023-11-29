import React from 'react';
import { LabeledInput } from '../labeled-controls';

export type ParametersModuleProps = {
    setDistortionProbability: (value: number) => void;
    distortionProbability: number;
};

/** Module responsible for modifying of parameters, used in other modules. */
export const ParametersModule: React.FC<ParametersModuleProps> = props => {
    const { distortionProbability, setDistortionProbability } = props;

    const [displayValue, setDisplayValue] = React.useState<string>(distortionProbability.toString());
    const [errorMessage, setErrorMessage] = React.useState<string>();

    // A validating setter function for distortion probability input.
    const onChange = React.useCallback(
        (value: string) => {
            setDisplayValue(value);
            const distProbability = parseFloat(value);

            if (value === '') return;
            if (!/^[+-]?\d+(\.\d+)?$/.test(value) || isNaN(distProbability))
                return setErrorMessage('Invalid number entered.');
            if (distProbability < 0 || distProbability > 1) return setErrorMessage('Number has to be between 0 and 1.');

            setDistortionProbability(distProbability);
            setErrorMessage(undefined);
        },
        [setDistortionProbability],
    );

    return (
        <LabeledInput
            id="distortion-param"
            inputMode="numeric"
            title="Change channel distortion probability"
            placeholder="Enter a number between 0 and 1."
            value={displayValue}
            setValue={onChange}
            errorMessage={errorMessage}
        />
    );
};
