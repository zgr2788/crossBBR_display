// App driver script

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PageProvider } from './context/PageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <PageProvider>
        <App />
    </PageProvider>
    
);
