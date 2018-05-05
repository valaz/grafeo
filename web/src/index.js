import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {Router} from 'react-router-dom';
import App from "./app/App";
import data from "./locale/messages";
import {flattenMessages} from "./util/util"
import ReactGA from 'react-ga';

import moment from 'moment';
import 'moment/locale/ru';
import {addLocaleData, IntlProvider} from 'react-intl';
import en from "react-intl/locale-data/en";
import ru from "react-intl/locale-data/ru";
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import createHistory from 'history/createBrowserHistory'
import {getGaUid} from './util/APIUtils'

addLocaleData([...en, ...ru]);

let locale =
    (navigator.languages && navigator.languages[0])
    || navigator.language
    || navigator.userLanguage
    || 'en-US';
const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];


if (languageWithoutRegionCode === 'ru') {
    moment.locale('ru');
} else {
    moment.locale('en');
}
const messages = data[languageWithoutRegionCode] || data[locale] || data.en;

let gaUid = '';
let promise = getGaUid();
if (promise) {
    promise.then(response => {
            gaUid = response.uid;
            ReactGA.initialize(gaUid);
        }
    ).catch(error => {

    })
}

const history = createHistory()
history.listen((location, action) => {
    ReactGA.set({page: location.pathname});
    ReactGA.pageview(location.pathname);
});

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <IntlProvider locale={locale} messages={flattenMessages(messages)}>
            <Router history={history}>
                <App/>
            </Router>
        </IntlProvider>
    </MuiPickersUtilsProvider>, document.getElementById('root'));
registerServiceWorker();
