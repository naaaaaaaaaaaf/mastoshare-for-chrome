import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShareComponent from './ShareComponent'; 
import SettingsComponent from './SettingsComponent';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/index.html" element={<ShareComponent />} />
                <Route path="/settings" element={<SettingsComponent />} />

            </Routes>
        </Router>
    );
}

export default App;
