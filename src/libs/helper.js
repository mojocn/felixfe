

export function parseUser(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let user = JSON.parse(jsonPayload);

    localStorage.setItem("token", token);
    localStorage.setItem("expire_ts", user.exp);
    localStorage.setItem("user", jsonPayload);
    return user;
}