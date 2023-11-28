import React from 'react';
import './label.scss';

export type LabelProps = {
    id: string;
    title: string;
};

export const Label: React.FC<LabelProps> = props => {
    return (
        <label className="coding-theory-label" htmlFor={props.id}>
            {props.title}
        </label>
    );
};
