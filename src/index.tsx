import ReactDOM from 'react-dom';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import DarwinApi from 'services/api/DarwinApi';
import PrinterApi from 'services/api/PrinterApi';
import config from 'config/config';
import { configureStore } from 'redux/store';
import ElectronApi from 'services/api/ElectronApi';

DarwinApi.initialize(config.api.url);
PrinterApi.initialize(config.printerServerUrl);
ElectronApi.initialize(config.electronServerUrl);

ReactDOM.render(
    <Provider store={configureStore({})}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
