<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand">圆周率测试</a>
        </div>
        <div>
          <ul class="nav navbar-nav">
            <li><a href="https://github.com/qiangmouren/pi-test">GitHub</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="page-header">
        <h1>圆周率测试</h1>
        <hr />
        <div class="row center-block">
          <div class="lead">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th width="20%">位数</th>
                  <th width="10%">耗时</th>
                  <th v-if="outputResult">结果</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of result" :key="item.digit">
                  <td>圆周率{{ item.digit }}位</td>
                  <td>{{ item.spend || '...' }}</td>
                  <td v-if="outputResult" @click="download(item.digit)" title="点击下载">{{ item.digits }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center">
        <div>
          <input
            type="checkbox"
            v-model="outputResult"
            :disabled="running"
            style="height: 14px; width: 14px; margin: 0; vertical-align: middle"
          />
          <span style="vertical-align: middle"> 输出结果(可能会影响效率)</span>
        </div>
        <div style="margin-left: 10px; margin-top: -1px">
          <span style="vertical-align: middle">定义位数: </span>
          <input
            type="text"
            v-model="defineDigits"
            placeholder="1000,2000,3000,4000"
            style="height: 16px; vertical-align: middle; min-width: 220px"
            :disabled="running"
          />
        </div>
      </div>

      <div style="display: flex; justify-content: center; margin-top: 20px">
        <button class="btn btn-primary" @click="start" :disabled="running">开始测试</button>
      </div>

      <div class="text" style="display: none; margin-left: 33px">
        <p>刚开始可能浏览器没什么事，到最后越来越多的时候页面会卡死，我已经使用promise/async处理，没有卵用</p>
        <p>所以当浏览器弹出网页无响应的时候，<b>请点击等待</b>，不想继续等可以点击关闭</p>
      </div>
      <h3>圆周率</h3>
      <p>圆周率（Pi）是圆的周长与直径的比值，一般用希腊字母π表示，是一个在数学及物理学中普遍存在的数学常数</p>
      <h3>圆周率测试</h3>
      <p>测试浏览器/设备的性能。本工具计算圆周率小数点的位数，获取运算总耗时。</p>
    </div>
  </div>
</template>
<script>
import Worker from './utils/worker?worker';
export default {
  data() {
    return {
      running: false,
      outputResult: true,
      defineDigits: '1000,5000,10000,50000,100000',
      result: [],
    };
  },
  methods: {
    start() {
      this.result = [...new Set(this.defineDigits.split(','))]
        .map((x) => x.trim())
        .sort((a, b) => a - b)
        .map((x) => {
          return {
            digit: x,
            spend: null,
          };
        });

      this.running = true;
      let ret = 0;
      this.result.forEach((e) => {
        let replay = false;
        let worker = new Worker();
        worker.onmessage = (msg) => {
          ret++;
          const item = this.result.find((x) => x.digit == e.digit);
          item.spend = msg.data.spend;
          if (msg.data.digits) item.digits = msg.data.digits;
          if (!replay && this.outputResult) {
            worker.postMessage({
              digit: item.digit,
              outputResult: this.outputResult,
            });
            replay = true;
          }
          if (ret == this.result.length * (this.outputResult ? 2 : 1)) {
            this.running = false;
          }
        };
        worker.postMessage({ digit: e.digit });
      });
    },
    download(digit) {
      const URL = window.URL || window.webkitURL || window.mozURL;
      const text = this.result.find((x) => x.digit == digit).digits;
      const blob = new Blob([text], { type: 'text/plain' });
      const fileName = `π-${digit}-${Date.now()}.txt`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
};
</script>
