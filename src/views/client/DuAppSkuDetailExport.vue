<template>
	
	<div id="DuAppSkuDetailExport">

		<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					导出当天货号详情数据
				</div>
				<div class="admin-component-flex-box">
					<div class="admin-component-outer-content-left-box">
						
						<div style="width: 90%">
							<Alert type="success">
						        当前日期:{{timer}}
						        <template slot="desc">
						        	当前数据库需要抓取 
						        	<span style="color: #20282B;font-weight: bold">{{needDumpProductCount}}</span>
						        	 货号，今天已经抓取了 
						        	 <span style="color: #F46565;font-weight: bold">{{alreadyDumpProductCount}}</span>
						        	  条.
						        </template>
						    </Alert>
						</div>

					</div>
					<div class="admin-component-outer-content-right-box">
						<Button type="error" icon="archive" @click="exportCurrentDayAllDetails">导出数据</Button>
					</div>	
				</div>
				
			</Card>
	 	</div>


	 	<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					导出历史货号详情数据
				</div>
				<div class="admin-component-flex-box">
					<div class="admin-component-outer-content-left-box">
						
						<div style="width: 90%">
							<DatePicker 
						    	v-if="hasDetailDates!==null"
						    	type="date" 
						    	:options="dateOptions" 
						    	placeholder="选择日期" 
						    	style="width: 100%;margin-bottom: 10px;"
						    	@on-change="selectHasDetailDate"
						    ></DatePicker>

							<Alert type="warning">
						        根据日期导出数据
						        <template slot="desc">
						        	注意: 选择日期时只有数据库存有对应日期的数据时才能选中
						        </template>
						    </Alert>

						</div>

					</div>
					<div class="admin-component-outer-content-right-box">
						<Button type="error" icon="archive" @click="exportDetailsByUpdate">导出数据</Button>
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
	let updateDates = []

	export default vuec({
		name:'DuAppSkuDetailExport',
		data:{
			loading:false,
			timer: moment().format('YYYY-MM-DD'),
			hasDetailDates:null,
			alreadyDumpProductCount:0,
			needDumpProductCount:0,

			selectDate:null,

			dateOptions:{
				disabledDate(dateParam){
					let date = moment(dateParam).format('YYYY-MM-DD')
					return !updateDates.includes(date)
				}
			},
		},


		async created() {
			await this.getDatas()
		},

		methods:{

			async getDatas() {
				this.alreadyDumpProductCount = await Http.requestAsync({
					url:'/duApp/getAlreadyDumpProductConut',
					data:{
						createAt:this.timer
					}
				})

				this.needDumpProductCount = await Http.requestAsync({
					url:"/duApp/getNeedDumpProductCount"
				})

				let allDumpDateListRes = await Http.requestAsync({
					url:'/duApp/getAllDumpCreateDateList',
				})

				allDumpDateListRes.forEach((data,idx)=>{
					updateDates.push(data['create_at'])
				})

				this.hasDetailDates = updateDates
			},


			selectHasDetailDate(date) {
				this.selectDate = date;
			},

			async exportCurrentDayAllDetails() {
				if ( this.alreadyDumpProductCount == 0 ) {
					this.$Notice.warning({title:'今天还没有抓取任何数据，请先抓取数据再导出'})
					return;
				}
				let targetServer = `${Http.getBaseURL()}/duApp/exportDetails`;
				window.location.href = targetServer
			},

			async exportDetailsByUpdate() {
				if ( this.selectDate === null ) {
					this.$Notice.warning({title:'请先选择要导出数据的日期'})
					return;
				}
				let targetServer = `${Http.getBaseURL()}/duApp/exportDetails?date=${this.selectDate}`;
				window.location.href = targetServer
			}

		},

	})

	
</script>







