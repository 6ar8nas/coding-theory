import React from 'react';
import { Label } from './label';

export type LabeledTextAreaProps = {
    setValue?: (value: string) => void;
    errorMessage?: string;
} & Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'onChange'>;

export const LabeledTextArea: React.FC<LabeledTextAreaProps> = props => {
    const { id, title, setValue, className, errorMessage, ...rest } = props;

    return (
        <div className="form-control">
            <Label htmlFor={id} title={title} errorMessage={errorMessage} />
            <textarea
                id={id}
                className={`textarea ${errorMessage ? 'textarea-error' : ''} ${className}`}
                onChange={x => setValue?.(x.target.value)}
                {...rest}
            />
        </div>
    );
};
