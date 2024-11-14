




//前台将RFC3339时间格式转换为正常格式
export function dateToString(timeString) {
    let date = new Date(timeString).toJSON();
    let timeZone = 8 * 3600 * 1000
    return new Date(+new Date(date) + timeZone).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
}

export function timeFormat(s) {
    return s.substr(2, 16).replace('T', ' ')
}