import React from 'react';
import { Label } from './label';
import './labeled-image.scss';

export type LabeledImageProps = {
    id: string;
    title: string;
    source?: string;
};

export const LabeledImage: React.FC<LabeledImageProps> = props => {
    const { id, title, source } = props;

    return (
        <div className="coding-theory-labeled-image">
            <Label id={id} title={title} />
            {source && <img id={id} src={source} />}
        </div>
    );
};
