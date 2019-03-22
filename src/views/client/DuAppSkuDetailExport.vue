<template>
	
	<div id="DuAppSkuDetailExport">

		<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					当前日期已经抓取了 <span style="color: #F46565;font-weight: bold">{{productCount}}</span> 条
				</div>
				<div class="admin-component-flex-box">
					<div class="admin-component-outer-content-left-box">
						
						<div style="width: 90%">
						    

							<DatePicker 
								v-if="hasDataDates !== null"
						    	:options="dateOptions" 
						    	type="date" 
						    	placeholder="选择日期" 
						    	style="width: 100%;margin-bottom: 10px;"
						    	:value="currentDate"
						    	@on-change="changeDate"
						    ></DatePicker>

							<Alert type="warning">
						        	
						        	 <template slot="desc">
						        	 	<p><span style="font-weight: bold">Warning:</span> 一般毒的数据数量不低于9000条，如果当前显示已经抓取数量低于这个数量的时候不建议导出，以免导出数据不完整</p>
						        	 	<div style="height: 10px;"></div>
						        	 	<p><span style="font-weight: bold">Warning:</span> 如果导出的数据，在前一天销量和尺码销量的列大量出现'--'的时候，说明前一天的销量数据还没有同步，稍后再重新导出</p>
						        	 </template>
						    </Alert>
						</div>

					</div>
					<div class="admin-component-outer-content-right-box">
						<Button 
							type="primary" 
							icon="archive" 
							@click="exportDatas"
							:disabled="isDisabled"
							:loading="loading"
						>导出数据</Button>
					</div>	
				</div>
				
			</Card>
	 	</div>

        <div style="height:200px;"></div>

	 </div>

</template>

<script>
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	import Event from "@/utils/Emitter"
	const moment = require('moment')

	let dates = []

	export default vuec({
		name:'DuAppSkuDetailExport',
		data:{
			loading:false,
			currentDate: moment().format('YYYY-MM-DD'),
			hasDataDates:null,
			productCount:0,

			selectDate:null,

			dateOptions:{
				disabledDate(dateParam){
					let date = moment(dateParam).format('YYYY-MM-DD')
					return !dates.includes(date)
				}
			},
		},


		async created() {
			await this.getDatas()
		},

		computed:{
			isDisabled() {
				return this.productCount > 0 ? false : true
			}
		},

		methods:{

			async getDatas() {
				this.checkDatas()
				let hasDataDates = await Http.requestAsync({
					url:"/du/getSellProductDetail",
					data:{
						conditions:JSON.stringify({
							raw:true,
							attributes:["create_at"],
							order:[["create_at","DESC"]],
							group:"create_at",
							limit:30
						})
					}
				})

				for ( let [idx,content] of hasDataDates.entries() ) {
					dates.push(content["create_at"])
				}

				this.hasDataDates = hasDataDates

			},

			changeDate(date) {
				this.currentDate = date;
				this.productCount = 0
				this.checkDatas()
			},

			async checkDatas() {
				let createAt = this.currentDate
				let res = await Http.requestAsync({
					url:"/du/getSellProductDetail",
					data:{
						conditions:{
							raw:true,
							attributes:["sku"],
							where:{
								create_at:createAt
							}
						}
					}
				})
				this.productCount = res.length
			},

			async exportDatas() {
				let createAt = this.currentDate
				this.loading = true
				let state = await Http.requestAsync({
					url:"/du/generateDataExcel",
					data:{
						createAt
					}
				})
				if ( state ) {
					this.loading = false
					let downloadApi = `${Http.getBaseURL()}/du/downloadDataExcel?createAt=${createAt}`;	
					window.location.href = downloadApi
				}
			},

		},

	})

	
</script>







