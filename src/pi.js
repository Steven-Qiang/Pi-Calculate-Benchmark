/*
* @description: 圆周率计算 copy ajennings.net/pi.html
* @Author: QiangMouRen 
* @Date: 2019-12-16 18:18:48 
 * @Last Modified by: QiangMouRen
 * @Last Modified time: 2019-12-16 21:03:24
*/

export default (() => {
    let i, x, pi, startTime;
    const splice = function (str, start, newStr) {
        return str.slice(0, start) + newStr + str.slice(start);
    };
    /**
     * @description
     * @author QiangMouRen
     * @date 2019-12-16
     * @param {number} digits 圆周率位数
     * @param {boolean} [async=true] 是否使用promise包装
     * @param {boolean} [turnπ=false]  是否返回计算的圆周率
     * @returns 
     */
    return function (digits, async = true, turnπ = false) {
        i = BigInt(1);
        x = BigInt(3) * (BigInt(10) ** (BigInt(digits) + BigInt(20)));
        pi = x;
        startTime = new Date();
        if (async) return new Promise((resolve) => resolve(runπ(digits, turnπ)));
        return runπ(digits, turnπ)
    }
    /**
     * @description 运行并计算用时
     * @author QiangMouRen 
     * @date 2019-12-16
     * @param {number} digits 圆周率位数
     * @param {boolean} turnπ 是否返回计算的圆周率
     * @returns 
     */
    function runπ(digits, turnπ) {
        if (x > 0) {
            for (let j = 0; j < 100; ++j) {
                x = x * i / ((i + BigInt(1)) * BigInt(4));
                if (turnπ) pi += x / (i + BigInt(2));
                i += BigInt(2);
            }
            return runπ(digits, turnπ);
        } else {
            return {
                dcount: digits,
                digits: turnπ ? splice((pi / (BigInt(10) ** BigInt(20))).toString(10), 1, '.') : null,
                elapsed: ((new Date() - startTime) / 1000).toFixed(3) + " s"
            };
        }
    }
})()