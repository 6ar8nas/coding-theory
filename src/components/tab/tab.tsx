import React from 'react';
import './tab.scss';

export type TabProps = {
    isActive: boolean;
    title: string;
    onSelect: () => void;
};

export const Tab: React.FC<TabProps> = props => {
    const { isActive, title, onSelect } = props;

    return (
        <a onClick={onSelect} className={`coding-theory-tab ${isActive ? 'tab-active' : ''}`}>
            {title}
        </a>
    );
};
