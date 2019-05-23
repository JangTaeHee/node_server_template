// 자릿수 정리 함수
exports.roundNumber = (number, digits) => {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}