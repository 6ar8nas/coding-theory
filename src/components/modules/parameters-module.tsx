import React from 'react';
import { LabeledInput } from '../labeled-controls';
import { useSettingsStore } from '../../state';

/** Module responsible for modifying of parameters, used in other modules. */
export const ParametersModule: React.FunctionComponent = () => {
    const { distortionProbability, setDistortionProbability } = useSettingsStore();

    const [displayValue, setDisplayValue] = React.useState<string>(distortionProbability.toString());
    const [errorMessage, setErrorMessage] = React.useState<string>();

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
            title="Change channel's distortion probability"
            placeholder="Enter a number between 0 and 1."
            value={displayValue}
            setValue={onChange}
            errorMessage={errorMessage}
        />
    );
};
