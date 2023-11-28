import React from 'react';
import './header.scss';
import { ViewMode } from '../../data-types/view-mode';
import { TabIdentifier } from '../../data-types/tab-identifier';
import { Tab } from '../tab/tab';

export type HeaderProps = {
    activeViewMode: ViewMode;
    setActiveViewMode: (viewMode: ViewMode) => void;
    tabs: TabIdentifier[];
};

export const Header: React.FC<HeaderProps> = props => {
    const { activeViewMode, setActiveViewMode, tabs } = props;

    return (
        <>
            <header className="coding-theory-header">
                <nav className="coding-theory-tabs">
                    {tabs.map(x => (
                        <Tab
                            key={x.name}
                            onSelect={() => setActiveViewMode(x.name)}
                            title={x.title}
                            isActive={activeViewMode == x.name}
                        />
                    ))}
                </nav>
                <address rel="author" className="coding-theory-author">
                    Šarūnas Griškus | Coding theory 2023/24 | A13
                </address>
            </header>
        </>
    );
};
