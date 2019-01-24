<template>
	<div id="DailyReportCurrentStockUpload">
		<Spin fix v-if="loading && loadingInfo !== null">
			<div
				style="font-size: 14px;margin-bottom: 10px;"
			>
				<span style="color:#414A52">{{loadingInfo['state']}}</span>
				<span>{{loadingInfo['filename']}}</span>
			</div>

			<div
				style="font-size: 14px"
			>
				<span style="color:#414A52">总进度: </span>
				<span style="color:#F46565">
					{{loadingInfo['uploaded']}} / {{loadingInfo['amountLength']}}
				</span>
			</div>

		</Spin>

		<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					日报现货表上传
				</div>

				<div class="flex-container-justify-between" style="margin-bottom: 20px;">
					<div style="width: 40%">
						<div style="font-size: 12px;margin-bottom: 5px">纠正日期:</div>
						<DatePicker 
						 	type="date" 
						 	v-model="date"
						 	style="width: 100%;"
						 ></DatePicker>
					</div>

					<div>
						<div style="font-size: 12px;margin-bottom: 5px">覆盖:</div>
					 	<iSwitch v-model="replace"></iSwitch>	
					</div>
				</div>

				<div style="width: 100%;">
					<Uploader 
						:acceptTypes="['xls','xlsx']"
						:uploadAreaIconSize="40"
						:extra="getInfo"
						@on-uploaded="getFileList"
						@on-process="getProcess"
					></Uploader>
				</div>

			</Card>
		</div>

		<div style="height:100px;"></div>
		
	</div>
</template>

<script type="text/javascript">
	import {vuec} from 'vuec'
	import Uploader from "@/components/upload/Uploader.vue"
	import Http from "@/utils/Http"
	import iSwitch from 'iview/src/components/switch/index'
	import moment from "moment"
	import Event from "@/utils/Emitter"
	export default vuec({
		name:'DailyReportCurrentStockUpload',

		data:{
			date:new Date,
			replace:true,
			loading:false,
			loadingInfo:null,
		},

		mounted() {
			let self = this
		},

		methods: {

			addUploadArea() {
				let self = this
				let content = JSON.parse(JSON.stringify(self.uploadAreasContent))
				self.uploadAreas.push(content)
			},

			getInfo() {
				var self = this
				let info = {
					date:moment(self.date).format("YYYY-MM-DD"),
					replace:self.replace
				}
				return info;
			},

			getProcess(processInfo) {
				let self = this
				if (!self.loading) self.loading = true
				let info = {
					'state':"正在上传:",
					'filename':processInfo['filename'],
					'amountLength':processInfo['amountLength'],
					'uploaded':processInfo['uploaded']
				}
				self.$nextTick(()=>{
					self.loadingInfo = JSON.parse(JSON.stringify(info))
				})
			},

			async getFileList(fileList) {
				let self = this
				let uploaded = 1
				let amountLength = Object.keys(fileList).length
				for (let [md5,file] of Object.entries(fileList)) {

						let filePath = file['path'] 
						let createTime = file['extra']['date']
						let replace = file['extra']['replace']

						let info = {
							'state':"正在分析:",
							'filename':file['name'],
							'amountLength':amountLength,
							'uploaded':uploaded
						}

						self.loadingInfo = JSON.parse(JSON.stringify(info))

						let res = await Http.requestAsync({
							url:'/daily/handleExistingTable',
							data:{
								filePath,
								createTime,
								replace	
							}
						})

						uploaded+=1

				}

				self.loading = false
				self.loadingInfo = null
				self.$Notice.success({title:"上传成功"})
			}
		},

		components:{
			iSwitch,
			Uploader
		}
	})
</script>

<style type="text/css">
	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);

	#DailyReportCurrentStockUpload {
		width: 100%;
		position: relative;
	}
</style>