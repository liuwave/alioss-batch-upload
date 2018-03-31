var ABU=require('../');

var a=new ABU({
	accessKeyId: 'x',
	accessKeySecret: 'x',
	region: 'oss-cn-beijing',
	bucket: 'quill-docs',
	ossDir:'/test/',
	internal:true
})

a.upload('./');