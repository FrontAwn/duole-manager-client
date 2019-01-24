<template>
	<div id="BigFileUploader" >
		<div :style="uploadAreaStyle" class="upload-container-class">
			<form id="upload-excel-from">
	            <input 
	            	multiple 
	            	type="file" 
	            	:id="uploadAreaId"
	            	class="upload-file-input-class" 
	            	@change="addUploadFile"
	            />

	            <div class="upload-file-input-icon-class">
	                <Icon type="ios-cloud-upload" :size="uploadAreaIconSize" style="color: #00C3B6"></Icon>
	                <div style="padding-left: 20px;padding-right: 20px">{{uploadAreaText}}</div>
	            </div>
	        </form>
		</div>

		<div 
			class="flex-container-wrap" 
			style="margin-top: 10px;" 
			v-if="Object.keys(fileList).length !== 0"
		>
			<div 
				v-for="(file,md5) in fileList"
				style="margin-right: 10px;" 
			>
				<Alert 
					type="success" 
					show-icon 
					closable
					@on-close="deleteUploadFile(md5)"
				>
					<Icon type="document" slot="icon"></Icon>
					<div style="margin-top: 10px;">{{file.name}}</div>
					<div slot="desc">
						<p>选择的日期:{{file.extra.date}}</p>
					</div>
				</Alert>	
			</div>
			
		</div>
		
		<div 
			class="flex-container-justify-end" 
			style="margin-top: 20px;"
		>
			<Button type="error" @click="beginUpload()">开始上传</Button>
		</div>


	</div>
</template>

<script>
	import {vuec} from "vuec"
	import SparkMD5 from 'spark-md5'
	import Http from "@/utils/Http.js"
	export default vuec({
		name:"BigFileUploader",
		props:{
			uploadAreaWidth:{
				type:String,
				default:"100%"
			},

			uploadAreaHeight:{
				type:String,
				default:"100px"
			},

			uploadAreaId:{
				type:String,
				default:"upload-excel-file-input"
			},

			uploadAreaIconSize:{
				type:Number,
				default:68
			},

			uploadAreaText:{
				type:String,
				default:''
			},

			acceptTypes:{
				type:Array,
				default:()=>{
					return ['*']
				}
			},
			extra:{
				type:Function,
				default:()=>{
					return null
				}	
			},
			uploadChunkSize:{
				type:Number,
				default:1
			}
		},
		data:{
			uploadAreaDOM:null,
			fileList:{},
			uploaded:0,
		},

		computed:{
			uploadAreaStyle(){
				return {
					"width":this.uploadAreaWidth,
					"height":this.uploadAreaHeight,
					"position":"relative"
				}
			}
		},

		mounted() {
			let self = this
			this.uploadAreaDOM = document.getElementById(this.uploadAreaId)
		},

		methods:{
			// 点击上传触发
			async addUploadFile() {
				let self = this
				let files = this.uploadAreaDOM.files
				let res = {}
				for ( let i=0; i<files.length; i++ ) {
					let file = files[i]
					if ( self.isAcceptType(file) ) {
						let name = file.name
						let md5 = await self.getFileMD5(file)
						let content = file
						let extra = self.extra()

						res[md5] = {}
						res[md5] = {
							name,
							md5,
							content,
							extra
						}
					}
				}

				self.$nextTick(()=>{
					self.fileList = {...self.fileList,...res};
				})

			},

			deleteUploadFile(md5) {
 				let self = this
 				self.$nextTick(()=>{
 					delete self.fileList[md5]
 				})
 			},

			// 检查文件类型是否允许上传
			isAcceptType(file) {
				let types = this.acceptTypes
				let fileNameArray = file.name.split('.')
				let fileType = fileNameArray[fileNameArray.length-1];
				if ( types.includes('*') ) return true
				if ( types.length === 0 ) {
					this.$Notice.warning({title:'允许上传的类型不能为空'})
					return false;
				}
				if( types.includes(fileType) ) {
					return true;
				} else {
					this.$Notice.warning({title:'不支持上传此类型文件'})
					return false;
				}
			},

			// 分块获取整个文件的MD5，默认分块大小1M
			getFileMD5(file) {
				var self = this
				return new Promise((resolve,reject)=>{
					var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
					var chunkSize = self.uploadChunkSize * 1024 * 1024;
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


			async beginUpload() {
				let self = this
				let files = self.fileList
				if (Object.keys(files).length === 0) {
					self.$Notice.warning({title:"当前没有要上传的文件"})
					return;
				}
				let existChunks = await self.getExistChunks(files);
				let needUploadChunks = await self.getNeedUploadChunks(existChunks)
				await self.uploadChunks(needUploadChunks);
 			},

 			async getExistChunks(files) {
				return await Http.requestAsync({
					url:"/upload/getExistChunks",
					data:{
						files,
					},
				})
 			},

 			async getNeedUploadChunks(existChunks) {
 				let self = this
 				let sliceChunkSize = self.uploadChunkSize * 1024 * 1024
 				let res = {}
 				for (let [md5,chunks] of Object.entries(existChunks)) {
 					let fileSize = self.fileList[md5]['content'].size
 					let chunkNums = Math.ceil(fileSize / sliceChunkSize);
 					let needUploadChunks = [] 
 					for (let idx=0; idx<chunkNums; idx++) {
 						if ( !chunks.includes(idx+"") ) {
 							needUploadChunks.push(idx)
 						}
 					}
 					res[md5] = needUploadChunks;
 				}
 				return res;
 			},


 			async uploadChunks(needUploadChunks) {
 				let self = this
 				let sliceChunkSize = self.uploadChunkSize * 1024 * 1024
 				let amountLength = Object.keys(self.fileList).length
 				let idx = 1
 				for(let [md5,chunks] of Object.entries(needUploadChunks)) {

 					if ( chunks.length === 0 ) {
 						console.log(`${self.fileList[md5]['name']} 已经存在`)
 						await self.mergeChunks(md5)
 						self.$emit("on-process",{
 							amountLength,
 							uploaded:self.uploaded,
 							filename:self.fileList[md5]['name']
 						})
 						continue;
 					}
 					let fileContent = self.fileList[md5]['content']
 					let fileSize = fileContent.size
 					for ( let idx of chunks.values() ) {
 						let startOffset = idx * sliceChunkSize
 						let endOffset = (idx + 1) * sliceChunkSize >= fileSize ? fileSize : (idx + 1) * sliceChunkSize
 						let fileChunkContent = fileContent.slice(startOffset,endOffset)
		 					let form = new FormData();
 							form.append("chunk",fileChunkContent)
	 						form.append("md5",md5)
	 						form.append("idx",idx)
	 						await Http.requestAsync({
			 					method:"post",
			 					url:"/upload/writeChunks",
			 					dataType:"file",
			 					data:form
			 				})	
 					}
 					console.log(`${self.fileList[md5]['name']} 开始合成`)
 					await self.mergeChunks(md5)
 					self.$emit("on-process",{
						amountLength,
						uploaded:self.uploaded,
						filename:self.fileList[md5]['name']
					})
 				}
 				self.$emit("on-uploaded",self.fileList);
 				self.fileList = {}
 				self.uploaded = 0
 			},


 			async mergeChunks(md5) {
 				let self = this
 				let file = self.fileList[md5]
 				let name = file['name']
 				let res = await Http.requestAsync({
 					url:"/upload/mergeChunks",
 					data:{
 						name,
 						md5
 					}
 				})
 				if (res.status) {
 					self.fileList[md5]['path'] = res.msg
					self.uploaded += 1
 				} else {
 					self.$Notice.error({title:msg})
 				}

 			},

		},
	})
</script>

<style scoped>

	#BigFileUploader {
		width: 100%;
		height: 100%;
	}

	.upload-container-class{
		border:1px dashed #e9eaec;
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