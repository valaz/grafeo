import {ACCESS_TOKEN, INDICATOR_LIST_SIZE} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getAllIndicators(page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: "/indicators?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getIndicator(id) {
    return request({
        url: "/indicators/" + id,
        method: 'GET'
    });
}

export function createIndicator(indicatorData) {
    return request({
        url: "/indicators",
        method: 'POST',
        body: JSON.stringify(indicatorData)
    });
}

export function editIndicator(indicatorData) {
    return request({
        url: "/indicators",
        method: 'PUT',
        body: JSON.stringify(indicatorData)
    });
}

export function deleteIndicator(id) {
    return request({
        url: "/indicators/" + id,
        method: 'DELETE'
    });
}

export function addRecord(recordData) {
    return request({
        url: "/indicators/" + recordData.indicatorId + "/records",
        method: 'POST',
        body: JSON.stringify(recordData)
    });
}

export function removeRecord(recordData) {
    return request({
        url: "/indicators/" + recordData.indicatorId + "/records",
        method: 'DELETE',
        body: JSON.stringify(recordData)
    });
}

export function login(loginRequest) {
    return request({
        url: "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function editProfile(signupRequest) {
    return request({
        url: "/user/me",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedIndicators(username, page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: "/users/" + username + "/indicators?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getGaUid() {
    return request({
        url: "/api/common/ga",
        method: 'GET'
    });
}