import React from 'react';
import { Label } from './label';
import './labeled-input.scss';

export type LabeledInputProps = {
    id: string;
    title: string;
    value: string;
    setValue?: (value: string) => void;
    errorMessage?: string;
} & Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'id' | 'value'
>;

export const LabeledInput: React.FC<LabeledInputProps> = props => {
    const { id, title, value, setValue, errorMessage, ...rest } = props;

    return (
        <div className={`coding-theory-labeled-input ${props.className ?? ''}`} aria-description={id}>
            <Label id={id} title={title} errorMessage={errorMessage} />
            <input
                {...rest}
                id={id}
                className="coding-theory-input"
                value={value}
                onChange={x => setValue?.(x.target.value)}
            />
        </div>
    );
};
