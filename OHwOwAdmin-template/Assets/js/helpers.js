//價錢三位一點
function CurrencyFormat(num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

//日期時間格式化
function DateFormat(value, format) {
    return moment(value).format(format || 'YYYY/MM/DD');
}

//超過指定內容長度以...取代
function StringContentFormat(content, maxlength = 1) {
    if (maxlength <= 0 || content.length <= maxlength) {
        return content;
    }
    else {
        return content.substring(0, maxlength - 1) + '...';
    }
}