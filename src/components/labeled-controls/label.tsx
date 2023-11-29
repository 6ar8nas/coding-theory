import React from 'react';
import './label.scss';

export type LabelProps = {
    id: string;
    title: string;
    errorMessage?: string;
};

export const Label: React.FC<LabelProps> = props => {
    return (
        <section className="coding-theory-label-wrapper">
            <label className="coding-theory-label" htmlFor={props.id}>
                {props.title}
            </label>
            {props.errorMessage && <aside className="coding-theory-label-error-message">{props.errorMessage}</aside>}
        </section>
    );
};
