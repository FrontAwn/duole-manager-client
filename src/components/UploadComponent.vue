<template>
	<div id="Upload" class="upload-container-class">
		<form id="upload-excel-from">
            <input 
            	multiple 
            	type="file" 
            	id="upload-excel-file-input" 
            	class="upload-file-input-class" 
            	@change="clickFileChange"
            />

            <div class="upload-file-input-icon-class">
                <Icon type="ios-cloud-upload" size="68" style="color: #28282E"></Icon>
                <div style="padding-left: 20px;padding-right: 20px">{{uploadAreaText}}</div>
            </div>
        </form>
	</div>
</template>

<script>
	import {vuec} from "vuec"
	import axios from 'axios'
	import SparkMD5 from 'spark-md5'
	import Http from "@/utils/Http.js"
	export default vuec({
		name:"Upload",
		props:{
			uploadAreaText:{
				type:String,
				default:'请点击此区域或把文件拖入此区域上传文件'
			},

			acceptTypes:{
				type:Array,
				default:()=>{
					return ['*']
				}
			},
		},
		data:{
			fileInputDOM:null,
			fromDOM:null,
			baseUrl:'http://localhost:7001',

		},
		mounted() {
			this.fileInputDOM = document.getElementById('upload-excel-file-input')
			this.fromDOM = document.getElementById('upload-excel-from')
			this.dropFileChange()
		},

		methods:{
			// 点击上传触发
			clickFileChange() {
				var fileList = this.fileInputDOM.files
				if ( !this.isSelectFile(fileList) ) return;
				this.beginUploads(fileList)
			},

			// 拖拽上传触发
			dropFileChange() {
				var self = this
				self.fileInputDOM.addEventListener('drop',e=>{
					e.preventDefault()
					var fileList = e.dataTransfer.files
					if ( !this.isSelectFile(fileList) ) return;
					this.beginUploads(fileList)
				})
			},


			async beginUploads(fileList) {
				var self = this 
				for ( let i=0; i<fileList.length; i++ ) {
					if ( this.isAcceptType(fileList[i]) ) {
						await self.uploadBigFile(fileList[i])
					} else {
						this.$Notice.error({
							title:`${fileList[i].name}`,
							desc:`文件类型被拒绝`
						})
					}
				}
			},


			// 判断当前是否选择了文件
			isSelectFile(fileList) {
				if (!fileList.length || fileList.length === 0) {
					this.$Notice.warning({title:'当前没有选择文件'});
					return false
				} else {
					return true
				}
			},


			// 判断是否是大文件
			isBigFile(file) {
				let chunkSize = 2 * 1024 * 1024
				let fileSize = file.size
				if( fileSize >= chunkSize ) {
					return true;
				} else {
					return false;
				}
			},

			// 检查文件类型是否允许上传
			isAcceptType(file) {
				let types = this.acceptTypes
				let fileNameArray = file.name.split('.')
				let fileType = fileNameArray[fileNameArray.length-1];
				if ( types.includes('*') ) return true
				if ( types.length === 0 ) {
					this.$Notice.warning({title:'允许上传的类型不能为空'})
				}
				if( types.includes(fileType) ) {
					return true;
				} else {
					return false;
				}
			},

			// 上传大文件
			async uploadBigFile(file,defaultChunkSize=1) {
				var self = this
				var fileSize = file.size
				var chunkSize = defaultChunkSize * 1024 * 1024
				var chunks = Math.ceil(fileSize / chunkSize);
				var fileMD5 = await this.getFileMD5(file);
				var checkFileResult = await self.checkFileExists(file.name,fileMD5)
				if( checkFileResult.data.file ) {
					this.$Notice.warning({title:'文件已经存在'});
					return false;
				}
				var chunkList = checkFileResult.data.chunkList
				var alreadyUploadChunkLength = chunkList.length

				var notUploadChunkIdxs = this.getNotUploadChunk(file,fileMD5,chunkList,chunkSize);
				await this.uploadFileChunks({
					file,
					notUploadChunkIdxs,
					fileMD5,
					chunks,
					chunkSize,
				})

				let realPath = await this.mergeFileChunks(file,fileMD5)
				self.$emit('uploaded',realPath);
			},


			// 分块获取整个文件的MD5，默认分块大小1M
			getFileMD5(file,defaultChunkSize=1) {
				var self = this
				return new Promise((resolve,reject)=>{
					var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
					var chunkSize = defaultChunkSize * 1024 * 1024;
					var chunks = Math.ceil(file.size / chunkSize)
					var currentChunk = 0
	                var spark = new SparkMD5.ArrayBuffer()
	                var fileReader = new FileReader()

	                function nextLoadFileChunk() {
				        var start = currentChunk * chunkSize
				        var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
				        var blobChunk = blobSlice.call(file, start, end);
				        fileReader.readAsArrayBuffer(blobChunk);
				    }

	                fileReader.onload = function (e) {
                		spark.append(e.target.result);
				        currentChunk++;
				        if (currentChunk < chunks) {
				            nextLoadFileChunk();
				        } else {
							resolve(spark.end());
				        }
				    };

				    fileReader.onerror = function () {
				    	reject('slice chunk failed!')
				    };
				 
				    nextLoadFileChunk();
				})
			},

			// 检测文件是否已经上传
			async checkFileExists(filename,fileMD5) {
				var self = this
				let res = await Http.requestAsync({
					url:'/file/check_file_exists',
					data:{
						filename,
						fileMD5
					}
				});
				return res
			},

			// 得到文件没有上传的分块，如果是新的文件，则得到所有要上传的分块
			getNotUploadChunk(file,fileMD5,chunkList,chunkSize) {
				var fileSize = file.size
				var chunks = Math.ceil(fileSize / chunkSize);
				var notUploadChunkIdxs = []
				for ( let idx=0; idx<chunks; idx++ ) {
					let existChunk = chunkList.indexOf(idx + "") > -1
					// 判断还未上传的chunk
					if (!existChunk) {
						notUploadChunkIdxs.push(idx)
					}
				}
				return notUploadChunkIdxs;
			},


			// 开始上传文件分块
			async uploadFileChunks(fileDetail) {
				var self = this
				var {
					file,
					notUploadChunkIdxs,
					fileMD5,
					chunks,
					chunkSize
				} = fileDetail

				for (let i in notUploadChunkIdxs) {
					let end = (i + 1) * chunkSize >= file.size ? file.size : (i + 1) * chunkSize;
					let form = new FormData()
					form.append("fileSource", file.slice(i * chunkSize, end));
            		form.append("totalChunks", chunks);
            		form.append("currentChunkIdx", i);
            		form.append("fileMD5", fileMD5);

            		await Http.requestAsync({
						method:'post',
						url:'/file/upload_file_chunk',
						dataType:'file',
						data:form
					})
				}
			},

			// 合成所有文件块成文件
			async mergeFileChunks(file,fileMD5) {
				var fileName = file.name
				var res = await Http.requestAsync({
					url:'/file/merge_file_chunks',
					data:{
						fileName,
						fileMD5
					}
				})
				this.$Notice.success({title:'上传成功'})
				return res.data['realPath'];
			}

			
		},
	})
</script>

<style scoped>
	.upload-container-class {
		width: 100%;
		height: 100%;
		border:1px dashed #e9eaec;
		position:relative;
	}

	.upload-container-class:hover{
		border:1px dashed #28282E;
	}

	.upload-file-input-class {
		opacity:0;
		position:absolute;
		width:100%;height:100%;
		z-index: 100;
		cursor:pointer;
	}

	.upload-file-input-icon-class {
		width:100%;height:100%;
		position: absolute;	
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>