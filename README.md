# 圆周率测试

### 测试浏览器/设备的性能。

本工具计算圆周率小数点的位数，获取运算总耗时。
JavaScript浮点很弱，能计算出来但可能不准确。计算用时仅供参考



> 2019-12-16 
>
> 翻出来重新写了一遍，增加了一些功能，使用es6编写，webpack打包
>
> 在线测试地址 https://qiangmouren.github.io/pi-test/build/


### 增加了新功能

![](https://raw.githubusercontent.com/qiangmouren/pi-test/master/images/20-32-04.png)
![](https://raw.githubusercontent.com/qiangmouren/pi-test/master/images/20-34-43.png)
![](https://raw.githubusercontent.com/qiangmouren/pi-test/master/images/20-35-34.png)
![](https://raw.githubusercontent.com/qiangmouren/pi-test/master/images/20-35-44.png)

### 打包

我已经打包好了，src文件夹为源码，build为打包好的

#### 如果自己打包

环境：node.js > 10

##### 运行 

```
npm i -g webpack webpack-cli anywhere cnpm --registry=https://registry.npm.taobao.org
cnpm i
npm run build
npm start
```




### bug

bug请提交issue,我会及时处理