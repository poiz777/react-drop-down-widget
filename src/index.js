import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import jsonData from "./data/data";

// USING THE appRootID FROM THE JSON DATA IS NOT ACCIDENTAL...
// THIS WAS INTENTIONALLY DONE SO THAT ONE HAS THE FLEXIBILITY OF
// EMBEDDING THE WIDGET IN ANY OTHER APPLICATION WITHOUT BEING TIED TO
// A SPECIFIC ID... :-)
ReactDOM.render(<App />, document.getElementById(jsonData.appRootID));
