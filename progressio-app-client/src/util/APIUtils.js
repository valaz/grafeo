import {ACCESS_TOKEN, API_BASE_URL, INDICATOR_LIST_SIZE} from '../constants';

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

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/indicators?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getIndicator(id) {
    return request({
        url: API_BASE_URL + "/indicators/" + id,
        method: 'GET'
    });
}

export function createIndicator(indicatorData) {
    return request({
        url: API_BASE_URL + "/indicators",
        method: 'POST',
        body: JSON.stringify(indicatorData)
    });
}

export function addRecord(recordData) {
    return request({
        url: API_BASE_URL + "/indicators/" + recordData.indicatorId + "/records",
        method: 'POST',
        body: JSON.stringify(recordData)
    });
}

export function removeRecord(recordData) {
    return request({
        url: API_BASE_URL + "/indicators/" + recordData.indicatorId + "/records",
        method: 'DELETE',
        body: JSON.stringify(recordData)
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/indicators/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedIndicators(username, page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/indicators?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}