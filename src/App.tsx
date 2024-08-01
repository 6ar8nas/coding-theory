import React from 'react';
import { BinaryCodingModule, TextCodingModule, ImageCodingModule, ParametersModule } from './components/modules';
import { Header } from './components/header/header';
import { ViewMode, defaultViewMode, TabIdentifier } from './data-types';

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
    {
        name: 'parameters',
        title: 'Change parameters',
        component: <ParametersModule />,
    },
];

export const App: React.FunctionComponent = () => {
    const [activeViewMode, setActiveViewMode] = React.useState<ViewMode>(defaultViewMode);

    return (
        <>
            <Header activeViewMode={activeViewMode} setActiveViewMode={setActiveViewMode} tabs={tabs} />
            <hr />
            {tabs.find(x => x.name === activeViewMode)?.component}
        </>
    );
};
