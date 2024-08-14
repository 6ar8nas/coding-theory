import React from 'react';
import { Label } from './label';

export type LabeledImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export const LabeledImage: React.FC<LabeledImageProps> = props => {
    const { id, title, src, ...rest } = props;

    return (
        <div className="form-control">
            <Label htmlFor={id} title={title} />
            <div role="img" aria-label={title}>
                <img id={id} src={src} {...rest} />
            </div>
        </div>
    );
};
