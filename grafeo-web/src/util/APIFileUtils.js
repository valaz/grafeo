import {ACCESS_TOKEN} from '../constants';
import settings from "../config";

const requestFile = (options) => {
    const headers = new Headers({
        'Response-Type': 'blob',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    // return fetch(process.env.REACT_APP_SERVER_URL + options.url, options)
    return fetch(settings.SERVER_URL + options.url, options)
        .then(response =>
            response.blob().then(blob => {
                if (!response.ok) {
                    return Promise.reject(blob);
                }
                return blob;
            })
        );
};

const storeFile = (options) => {
    const headers = new Headers({});

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    // return fetch(process.env.REACT_APP_SERVER_URL + options.url, options)
    return fetch(settings.SERVER_URL + options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function downloadIndicator(id) {
    return requestFile({
        url: "/api/indicators/" + id + "/download",
        method: 'GET'
    });
}

export function uploadIndicator(id, file) {
    let data = new FormData();
    data.append('file', file);
    return storeFile({
        url: "/api/indicators/" + id + "/upload",
        method: 'POST',
        body: data
    });
}
