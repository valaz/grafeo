import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router} from 'react-router-dom';
import App from "./app/App";
import data from "./locale/messages";
import {flattenMessages} from "./util/util"

import ru_RU from 'antd/lib/locale-provider/ru_RU';
import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/ru';
import {addLocaleData, IntlProvider} from 'react-intl';
import en from "react-intl/locale-data/en";
import ru from "react-intl/locale-data/ru";
import {LocaleProvider} from "antd";

addLocaleData([...en, ...ru]);

let locale =
    (navigator.languages && navigator.languages[0])
    || navigator.language
    || navigator.userLanguage
    || 'en-US';
const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];

let antdLocale = en_US;

if (languageWithoutRegionCode === 'ru') {
    moment.locale('ru');
    antdLocale = ru_RU;
} else {
    moment.locale('en');
    antdLocale = en_US;
}
const messages = data[languageWithoutRegionCode] || data[locale] || data.en;


ReactDOM.render(
    <LocaleProvider locale={antdLocale}>
        <IntlProvider locale={locale} messages={flattenMessages(messages)}>
            <Router>
                <App/>
            </Router>
        </IntlProvider>
    </LocaleProvider>, document.getElementById('root'));
registerServiceWorker();
