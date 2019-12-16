/*
* @description: 首页文件
* @Author: QiangMouRen 
* @Date: 2019-12-16 18:19:05 
 * @Last Modified by: QiangMouRen
 * @Last Modified time: 2019-12-16 20:17:04
*/

import $ from "jquery";
import π from './pi';

; (async () => {
    const URL = window.URL || window.webkitURL || window.mozURL;
    const row = $(".row:last")
    const button = row.find("button:last");
    let digits = [1000, 5000, 10000, 50000, 100000, 1000000];
    let turnπ = false;
    /**
     * @description 下载文本文件 多年经验
     * @param {number} digit 位数
     * @param {string} pi 结果
     */
    const downπ = (digit, pi) => {
        if (!turnπ) return;
        const blob = new Blob([pi], { type: "text/plain" });
        const fileName = `PI${digit}-${new Date().valueOf()}.txt`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(link.href);
    }
    /**
     * @description 递进执行
     * @param {number} i
     */
    const run = (i) => {
        const digit = digits[i]
        // 如果结束了
        if (!digit) return row.css("visibility", "visible")
        // 调用计算函数 promise
        π(digit, true, turnπ).then((result) => {

            const parent = $(`span:contains("${digit}")`).eq(0).parents("tr");
            const td = parent.find("td:not(:eq(0))");
            td.eq(0).text(result.elapsed)
            turnπ && td.eq(1).text("点击下载结果").click(() => downπ(digit, result.digits));
            // 完了再递进执行
            setTimeout(() => run(i + 1), 300);
        })
    }
    row.find("button:first").click(() => {
        const old = ''
        while (true) {
            let _digits = prompt("请输入要计算的位数，逗号分割", (old != "") ? old : digits.toString());
            if (!_digits) return;
            if (!/^[\d,，]+$/.test(_digits)) {
                if (confirm("只能输入数组和逗号，是否重新输入")) {
                    old = _digits;
                    continue;
                } else return;
            } else {
                digits = _digits.split(/[,，]/);
                return alert("设置完毕，请点击按钮开始")
            }
        }
    })
    button.click(() => {
        // 是否输出计算结果并显示下载按钮
        turnπ = Boolean($("input[type=checkbox]:last").is(':checked'));
        $("table:first thead").html(`
            <tr>
                <th ${turnπ && 'width="30%"'}>位数</th>
                <th ${turnπ && 'width="20%"'}>耗时</th>
                ${turnπ && '<th>运算结果</th>"'}
            </tr>
        `);
        $("table:first tbody").html("");
        // 填充表格
        for (let i = 0; i < digits.length; i++) {
            $("table:first tbody").append(`
                <tr>
                    <td>圆周率<span>${digits[i]}</span>位</td>
                    <td>未知</td>
                    ${turnπ ? '<td>未知</td>' : ''}
                </tr>
            `);
        }
        setTimeout(() => row.css("visibility", "hidden"), 0);
        // 开始第一个
        setTimeout(() => run(0), 500);
    });

})();