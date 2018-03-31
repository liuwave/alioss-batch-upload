# alioss-batch-upload
阿里云OSS，遍历目录并批量上传至阿里云OSS



## 安装

```bash
$ npm install alioss-batch-upload --save
```

## 示例

```javascript
var ABU=require('alioss-batch-upload');

var abu=new ABU({
	accessKeyId: 'your aliyun accessKeyId',
	accessKeySecret: 'your aliyun accessKeySecret',
	region: 'your region',
	bucket: 'your bucket',
	ossDir:'/test/',//阿里云OSS根目录，默认为'/',
	pattern:''
	
})
abu.upload('./');//上传当前目录
```
## option参数

+ [accessKeyId] {String} 通过阿里云控制台创建的access key。
+ [accessKeySecret] {String} 通过阿里云控制台创建的access secret。
+ [bucket] {String} 通过控制台创建的bucket, 或通过putBucket创建。
+ [region] {String} bucket 所在的区域, 默认 oss-cn-hangzhou。
+ [internal] {Boolean} 是否使用阿里云内部网访问，比如采用ecs访问oss，设置true, 采用internal的endpoint 会节约费用, 默认false。
+ [timeout] {String|Number} 超时时间, 默认 60s。
+ [ossDir] {String} 阿里云OSS根目录，默认为'/',
+ [pattern] 正则表达式/ 函数

```javascript
function pattern(filename) {
  // filename 是当前文件的完整路径
  // 返回 true 表示该文件名符合条件
}
```




## 运行效果
```text
>node test/test.js
[==================================================]   28/28  error:no_error
完成
```
