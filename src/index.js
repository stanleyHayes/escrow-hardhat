import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider, createTheme, CssBaseline} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    typography: {fontFamily: "Manrope, Outfit"},
    shape: {borderRadius: 0},
    palette: {
        mode: "dark",
        background: {default: "#111111", paper: "#282828"},
        text: {primary: "#ededed", secondary: "#787878"},
        primary: {main: "#111111"},
        secondary: {main: "#c1311b"}
    }
});

if (!window.ethereum) {
    root.render(
        <React.StrictMode>
            You need to install a browser wallet to build the escrow dapp
        </React.StrictMode>
    );
} else {
    root.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme={true}/>
                <App/>
            </ThemeProvider>
        </React.StrictMode>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
