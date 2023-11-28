import React from 'react';
import './labeled-text-area.scss';
import { Label } from './label';

export type LabeledTextAreaProps = {
    id: string;
    title: string;
    value: string;
    setValue?: (value: string) => void;
} & Omit<
    React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    'onChange' | 'id' | 'value'
>;

export const LabeledTextArea: React.FC<LabeledTextAreaProps> = props => {
    const { id, title, value, setValue, ...rest } = props;

    return (
        <div className={`coding-theory-labeled-text-area ${props.className ?? ''}`} aria-description={id}>
            <Label id={id} title={title} />
            <textarea
                {...rest}
                id={id}
                className="coding-theory-text-area"
                value={value}
                onChange={x => setValue?.(x.target.value)}
            />
        </div>
    );
};
