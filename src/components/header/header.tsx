import React from 'react';
import { ViewMode, TabIdentifier } from '../../data-types';
import { Tab } from '../tab/tab';
import './header.scss';

export type HeaderProps = {
    activeViewMode: ViewMode;
    setActiveViewMode: (viewMode: ViewMode) => void;
    tabs: TabIdentifier[];
};

export const Header: React.FC<HeaderProps> = props => {
    const { activeViewMode, setActiveViewMode, tabs } = props;

    return (
        <header className="coding-theory-header">
            <nav>
                {tabs.map(x => (
                    <Tab
                        key={x.name}
                        onSelect={() => setActiveViewMode(x.name)}
                        title={x.title}
                        isActive={activeViewMode === x.name}
                    />
                ))}
            </nav>
            <address rel="author" className="coding-theory-author">
                Šarūnas Griškus | Coding theory | Golay C23
            </address>
        </header>
    );
};
