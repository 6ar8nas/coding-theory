import React from 'react';
import './labeled-file-upload.scss';
import { Label } from './label';

export type LabeledFileUploadProps = {
    id: string;
    title: string;
    setValue: (file: File | undefined) => void;
} & Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'id' | 'value' | 'type'
>;

export const LabeledFileUpload: React.FC<LabeledFileUploadProps> = props => {
    const { id, title, setValue, ...rest } = props;

    return (
        <div className={`coding-theory-labeled-file-upload ${props.className ?? ''}`} aria-description={id}>
            <Label id={id} title={title} />
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
