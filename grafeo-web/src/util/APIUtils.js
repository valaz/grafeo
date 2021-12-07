import {ACCESS_TOKEN, INDICATOR_LIST_SIZE} from '../constants';
import settings from "../config";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (!options.public && localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    console.log('Config Server URL:' + settings.SERVER_URL )
    console.log('Request URL:' + options.url )
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

export function getIndicator(id) {
    return request({
        url: "/api/indicators/" + id,
        method: 'GET'
    });
}

export function createIndicator(indicatorData) {
    return request({
        url: "/api/indicators",
        method: 'POST',
        body: JSON.stringify(indicatorData)
    });
}

export function editIndicator(indicatorData) {
    return request({
        url: "/api/indicators",
        method: 'PUT',
        body: JSON.stringify(indicatorData)
    });
}

export function deleteIndicator(id) {
    return request({
        url: "/api/indicators/" + id,
        method: 'DELETE'
    });
}

export function addRecord(recordData) {
    return request({
        url: "/api/indicators/" + recordData.indicatorId + "/records",
        method: 'POST',
        body: JSON.stringify(recordData)
    });
}

export function removeRecord(recordData) {
    return request({
        url: "/api/indicators/" + recordData.indicatorId + "/records",
        method: 'DELETE',
        body: JSON.stringify(recordData)
    });
}

export function login(loginRequest) {
    return request({
        public: true,
        url: "/api/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function demoLogin() {
    return request({
        public: true,
        url: "/api/auth/demo/signin",
        method: 'POST',
    });
}

export function signup(signupRequest) {
    return request({
        public: true,
        url: "/api/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function facebookLogin(loginRequest) {
    return request({
        public: true,
        url: "/api/auth/fb/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function editProfile(signupRequest) {
    return request({
        url: "/api/users/me",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        public: true,
        url: "/api/users/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        public: true,
        url: "/api/users/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: "/api/users/me",
        method: 'GET'
    });
}

export function getUserProfile() {
    return request({
        url: "/api/users/profile",
        method: 'GET'
    });
}

export function getUserCreatedIndicators(id, page, size) {
    page = page || 0;
    size = size || INDICATOR_LIST_SIZE;

    return request({
        url: "/api/users/" + id + "/indicators?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getGaUid() {
    return request({
        public: true,
        url: "/api/common/ga",
        method: 'GET'
    });
}