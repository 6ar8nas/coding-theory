import React from 'react';
import { Label } from './label';
import './labeled-file-upload.scss';

export type LabeledFileUploadProps = {
    id: string;
    title: string;
    setValue: (file: File | undefined) => void;
    errorMessage?: string;
} & Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'id' | 'value' | 'type'
>;

export const LabeledFileUpload: React.FC<LabeledFileUploadProps> = props => {
    const { id, title, setValue, errorMessage, ...rest } = props;

    return (
        <div className={`coding-theory-labeled-file-upload ${props.className ?? ''}`} aria-description={id}>
            <Label id={id} title={title} errorMessage={errorMessage} />
            <input
                {...rest}
                id={id}
                className="coding-theory-input"
                type="file"
                onChange={x => setValue?.(x.target.files?.[0])}
            />
        </div>
    );
};
