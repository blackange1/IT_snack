export default function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// export function printf(line, color='red') {
//     if (typeof line === 'string') {
//         console.log(`%c${line}`, `color:${color}`);
//     } else {
//         console.log(`%c${line[0]}`, `color:${color}`);
//
//     }
// }

export function printReq(...args) {
    const style = 'color: white; /*background-color: white*/'
    const firstElem = args.shift()
    console.log(`%c => ${firstElem}`, style, ...args);
}

export function printFun(...args) {
    const style = 'color: yellow'
    const firstElem = args.shift()
    console.log(`%c${firstElem}`, style, ...args);
}


