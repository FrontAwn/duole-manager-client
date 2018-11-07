<template>
	<div id="DailyReportCurrentStockUpload">
		<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					日报现货表上传
				</div>

				<div class="admin-component-margin-bottom admin-component-flex-between-box">
					 <DatePicker 
					 	type="date" 
					 	placeholder="纠正日期" 
					 	:value="defaultDate"
					 	@on-change="changeDate"
					 ></DatePicker>
					 <div>
					 	<span style="margin-right:5px;margin-top:5px">覆盖:</span>
					 	<iSwitch v-model="switchStatus"></iSwitch>	
					 </div>
					 

				</div>



				<div style="height:300px">
					<BigFileUploader 
						@uploaded="getUploadedFilePath"
						:acceptTypes="['xls','xlsx']"
					></BigFileUploader>
				</div>
			</Card>
		</div>
	</div>
</template>

<script type="text/javascript">
	import {vuec} from 'vuec'
	import BigFileUploader from "@/components/upload/BigFileUploader.vue"
	import Http from "@/utils/Http"
	import iSwitch from 'iview/src/components/switch/index'
	export default vuec({
		name:'DailyReportCurrentStockUpload',

		data:{
			defaultDate:new Date,
			selectDate:null,
			switchStatus:true
		},
	
		methods: {
			async getUploadedFilePath(path) {
				var self = this

				window.setTimeout(async ()=>{
					let res = await Http.requestAsync({
						url:'/dailyReport/handleDailyReportFromCurrentStock',
						data:{
							filePath:path,
							selectDate:self.selectDate,
							replaceStatus:self.switchStatus
						}
					})
					self.$Notice.success({title:'数据保存完成'})
				},1000)
			},

			changeDate(date) {
				this.selectDate = date
			},

		},

		components:{
			iSwitch,
			BigFileUploader
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