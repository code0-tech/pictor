import React from 'react';
import MyComponent, { MyComponentProps } from './my-component';

export default {
    title: "MyComponent",
    component: MyComponent
};

export const Default = (props: MyComponentProps) => <MyComponent {...props} />;
