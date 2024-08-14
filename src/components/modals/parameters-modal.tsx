import React from 'react';
import { LabeledInput } from '../labeled-controls';
import { useSettingsStore } from '../../state';

export type ParametersModalProps = {
    dialogRef: React.Ref<HTMLDialogElement>;
};

/** Modal window responsible for changing parameter values, used in different app view panels. */
export const ParametersModal: React.FC<ParametersModalProps> = props => {
    const { dialogRef } = props;
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
        <dialog id="param-modal" className="modal modal-bottom sm:modal-middle" ref={dialogRef}>
            {/* Backdrop is here first to trap focus away from the first input. */}
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
            <div className="modal-box pt-3">
                <LabeledInput
                    id="distortion-param"
                    inputMode="numeric"
                    title="Change channel's distortion probability"
                    placeholder="Enter a number between 0 and 1."
                    value={displayValue}
                    setValue={onChange}
                    errorMessage={errorMessage}
                />
            </div>
        </dialog>
    );
};
