import React from 'react';
import { ViewMode } from './view-mode';

export type TabIdentifier = {
    name: ViewMode;
    title: string;
    component: React.JSX.Element;
};
