import React from 'react';
import { BinaryCodingModule, TextCodingModule, ImageCodingModule } from './components/views';
import { Header } from './components/header';
import { ViewMode, defaultViewMode, TabIdentifier } from './types';

const tabs: TabIdentifier[] = [
    {
        name: 'binary',
        title: 'Binary input',
        component: <BinaryCodingModule />,
    },
    {
        name: 'text',
        title: 'Text input',
        component: <TextCodingModule />,
    },
    {
        name: 'image',
        title: 'Image input',
        component: <ImageCodingModule />,
    },
];

export const App: React.FunctionComponent = () => {
    const [activeViewMode, setActiveViewMode] = React.useState<ViewMode>(defaultViewMode);

    return (
        <>
            <Header />
            <menu role="tablist" className="tabs tabs-bordered grid-cols-3" aria-orientation="horizontal">
                {tabs.map(x => (
                    <input
                        key={x.name}
                        type="radio"
                        name="viewmode-tab"
                        role="tab"
                        className="tab text-base"
                        aria-label={x.title}
                        onClick={() => setActiveViewMode(x.name)}
                        defaultChecked={defaultViewMode === x.name}
                    />
                ))}
            </menu>
            <main role="tabpanel" className="p-4">
                {tabs.find(x => x.name === activeViewMode)?.component}
            </main>
        </>
    );
};
