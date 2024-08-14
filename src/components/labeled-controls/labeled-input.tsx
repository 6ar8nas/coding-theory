import React from 'react';
import { Label } from './label';

export type LabeledInputProps = {
    setValue?: (value: string) => void;
    errorMessage?: string;
} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'>;

export const LabeledInput: React.FC<LabeledInputProps> = props => {
    const { id, title, setValue, className, errorMessage, ...rest } = props;

    return (
        <div className="form-control">
            <Label htmlFor={id} title={title} errorMessage={errorMessage} />
            <input
                id={id}
                type="text"
                className={`input input-bordered ${errorMessage ? 'input-error' : ''} ${className}`}
                onChange={x => setValue?.(x.target.value)}
                {...rest}
            />
        </div>
    );
};
