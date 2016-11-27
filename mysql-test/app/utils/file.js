// 文件上传下载
var fs = require('fs');
var path = require('path');

module.exports = {
	// files:上传文件
	upload: function(files){
		// return new Promise(function(){
		// });
		// console.log(files);
		var file = files['uploadPoster'];
		var tmpPath = file.path ;
		var originalFilename = file.originalFilename ;
		var type = file.type ;
		var size = file.size ;

		if(originalFilename){
			fs.readFile(tmpPath, function(err, data){
				var timestamp  = Date.now();
				type = type.split('/')[1] ;
				var newName = timestamp + '.' + type ;
				var newPath = path.join(__dirname,'../../', 'public/upload', newName);

				fs.writeFile(newPath , data, function(err){
					if(err){
						console.log(err);
						console.log('文件上传失败...');
						return ;
					}
					console.log('文件上传成功...');
					// 上传成功后，删除临时文件
					fs.unlink(tmpPath, function(err){
						if(err){
							console.log('临时文件删除失败...');
						}
					});
				})
			});
		}
	}	
};