import {ACCESS_TOKEN} from '../constants';

const requestFile = (options) => {
    const headers = new Headers({
        'Response-Type': 'blob',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.blob().then(blob => {
                if (!response.ok) {
                    return Promise.reject(blob);
                }
                return blob;
            })
        );
};

export function downloadIndicator(id) {
    return requestFile({
        url: "/indicators/" + id + "/download",
        method: 'GET'
    });
}
