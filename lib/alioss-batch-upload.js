const OSS = require('ali-oss');
const path = require("path");
const rd = require("rd");
const ProgressBar = require('progress');

exports = module.exports = AliOSSBatchUpload;

function AliOSSBatchUpload(options) {
	options=options || {};
	if(!options.accessKeyId){
		throw new Error('accessKeyId required');
	}
	if(!options.accessKeyId){
		throw new Error('accessKeySecret required');
	}
	this.accessKeyId=options.accessKeyId || '';
	this.accessKeySecret=options.accessKeySecret || '';
	this.region=options.region;
	this.bucket=options.bucket;
	this.internal=options.internal||false;
	this.timeout=options.timeout||'60s';


	this.ossDir=options.ossDir || '/';
	this.pattern=options.pattern || function (filename) {
		return filename.indexOf('node_modules')<0
	};
}




AliOSSBatchUpload.prototype.upload=function (dir,options) {
	options=options || {};
	this.region=options.region || this.region;
	this.bucket=options.bucket || this.bucket;
	if(!this.region){
		throw new Error('region required');
	}
	if(!this.bucket){
		throw new Error('bucket required');
	}
	this.ossDir=options.ossDir || this.ossDir;
	this.pattern=options.pattern || this.pattern;

	this.internal=options.internal||this.internal;
	this.timeout=options.timeout||this.timeout;

	const client = new OSS.Wrapper({
		region: this.region,
		accessKeyId: this.accessKeyId,
		accessKeySecret: this.accessKeySecret,
		bucket:this.bucket,
		internal:this.internal,
		timeout:this.timeout
	});
	var upload_path = path.resolve(dir)
	var total=0;
	var successCount=0;
	var _this=this;

	var bar = new ProgressBar('[:bar]   :successCount/:atotal  error::file', { total: 50 });
	rd.eachFileFilter(upload_path,this.pattern, function (f, s, next) {
		total++;
		var key=path.join(_this.ossDir,f.replace(upload_path,''));
		key=key.replace(/\\/mg,'\/');
		client.put(key, f).then(function (r) {
			successCount++;
			bar.tick(parseInt(successCount/total)*50,{
				atotal:total,
				successCount:successCount,
				file:'no_error'
			})
			next()
		}).catch(function (err) {
			bar.tick(parseInt(successCount/total)*50,{
				atotal:total,
				successCount:successCount,
				file:err+'|'+f+'\n'
			})
			next()
		})
	}, function (err) {
		if (err) {
			throw Error(err)
		}else{
			console.log('完成\n')
		}
	});
}
