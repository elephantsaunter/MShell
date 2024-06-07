//时间过滤
export const timeFiltering = (date) => {
    var time = new Date(date); //获取本地计算机时间

    //getMonth() 获得日期对象中的月份 (0 ~ 11)

    //     getDay() 获得日期是周几 (0代表周天，1-6分别代表周1-6)

    // getTime() 获得日期对象中的日期与 1970 年 1 月 1 日相差的毫秒数

    var year = time.getFullYear(); //对象.日期对象函数

    var month = time.getMonth(); //获得月份

    var day = time.getDate(); //获得当前几号

    var hours = time.getHours(); //获得小时

    var min = time.getMinutes(); //获得分钟

    var s = time.getSeconds(); //获得秒

    let times =
        year +
        "年" +
        (month + 1) +
        "月" +
        day +
        "日," +
        hours +
        ":" +
        min +
        ":" +
        s;
    return times;
};
//文件大小过滤
export function formatBytes(a, b) {
    if (0 == a) return "0 B";
    var c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}
//通过id搜索对象
export async function recursion(list, path, callback) {
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let itemPath = item.filename;
        if (itemPath == path) {
            callback(item);
            return;
        } else {
            if (item.children && item.children.length > 0) {
                recursion(item.children, path, callback);
            }
        }
    }
}