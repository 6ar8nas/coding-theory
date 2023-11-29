import React from 'react';
import { BinaryCodingModule, TextCodingModule, ImageCodingModule, ParametersModule } from './components/modules';
import { Header } from './components/header/header';
import { ViewMode, defaultViewMode, TabIdentifier } from './data-types';
import { defaultDistortionProbability } from './utils';

/** Main component, allowing to switch between different application modules. */
export const App = (): React.JSX.Element => {
    const [activeViewMode, setActiveViewMode] = React.useState<ViewMode>(defaultViewMode);
    const [distortionProbability, setDistortionProbability] = React.useState(defaultDistortionProbability);

    const tabs: TabIdentifier[] = [
        {
            name: 'binary',
            title: 'Binary input',
            component: <BinaryCodingModule distortionProbability={distortionProbability} />,
        },
        {
            name: 'text',
            title: 'Text input',
            component: <TextCodingModule distortionProbability={distortionProbability} />,
        },
        {
            name: 'image',
            title: 'Image input',
            component: <ImageCodingModule distortionProbability={distortionProbability} />,
        },
        {
            name: 'parameters',
            title: 'Change parameters',
            component: (
                <ParametersModule
                    distortionProbability={distortionProbability}
                    setDistortionProbability={setDistortionProbability}
                />
            ),
        },
    ];

    return (
        <>
            <Header activeViewMode={activeViewMode} setActiveViewMode={setActiveViewMode} tabs={tabs} />
            <hr />
            {tabs.find(x => x.name === activeViewMode)?.component}
        </>
    );
};
