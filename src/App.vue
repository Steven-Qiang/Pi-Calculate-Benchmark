<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand">圆周率计算 & 跑分</a>
        </div>
        <div>
          <ul class="nav navbar-nav">
            <li>
              <a href="https://github.com/qiangmouren/pi-test" target="_blank"
                ><i class="glyphicon glyphicon-tag"></i> GithubProject</a
              >
            </li>
            <li>
              <a href="https://qiangmou.ren" target="_blank"> <i class="glyphicon glyphicon-home"></i> StevenQiang</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="page-header">
        <h1>圆周率计算 & 跑分</h1>
        <h4>
          本工具可在浏览器中计算圆周率小数点后指定位数，并获得计算的总耗时。或许可以作为设备或浏览器的性能参考。
        </h4>
        <div class="row center-block">
          <div class="lead">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th width="20%">计算位数</th>
                  <th width="20%">计算耗时</th>
                  <th v-if="outputResult">计算结果</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of result" :key="item.digit">
                  <td>小数点后{{ item.digit }}位</td>
                  <td>{{ item.spend || '...' }}</td>
                  <td v-if="outputResult" @click="download(item.digit)" title="点击下载">
                    {{ !item.result ? 'calculating...' : item.result }}
                  </td>
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
        <button class="btn btn-block" @click="start" :disabled="running">开始计算</button>
      </div>
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
          const spend =
            msg.data.spend < 1000 ? msg.data.spend.toFixed(2) + 'ms' : (msg.data.spend / 1000).toFixed(3) + 's';
          if (!replay) item.spend = spend;
          if (msg.data.digits) {
            item.digits = msg.data.digits;
            item.result = '[点击下载结果] 计算[结果] 耗时 [' + spend + ']';
          }
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
