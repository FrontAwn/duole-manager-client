<template>
	<div id="DailyReportCurrentStockList">
		<!-- <div style="width: 100%;display: flex;">
			<div v-for="(datas,title) in result" style="width: 20%;">
				<div style="height: 40px;width: 100%;display: flex;justify-content: center;align-items: center;border:1px solid #dddee1;background: #e9eaec;">{{title}}</div>
				<div v-for="(data,opt) in datas" style="height: 40px;width: 100%;display: flex;justify-content: center;align-items: center;border-right:1px solid #dddee1;border-bottom: 1px solid #dddee1;">{{data}}</div>
			</div>	
		</div> -->
		<div style="width: 100%;height: 100%;display: flex;">
			<div style="width: 70%">
				<ECharts :options="amountLineOption" style="width: 100%;"></ECharts>
			</div>
		</div>
		<div style="height:30px;"></div>
		<div style="width: 100%;height: 100%;display: flex;">
				<ECharts :options="barByMaoriRateOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByStockAndRetailRateOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByEfficiencyValuesOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByDiscountOption" style="width: 50%;"></ECharts>
		</div>
		<div style="height:30px;"></div>
	</div>
</template>

<script type="text/javascript">
	import { vuec } from 'vuec'
	import Http from "@/utils/Http"
	import ECharts from 'vue-echarts/components/ECharts'
	import 'echarts'
	
	export default vuec({
		name:'DailyReportCurrentStockList',
		data:{
			sku:null,
			amountLineOption:{},
			// 毛利率
			barByMaoriRateOption:{},
			// 库销比
			barByStockAndRetailRateOption:{},
			// 效率值
			barByEfficiencyValuesOption:{},
			// 折扣
			barByDiscountOption:{},
			dates:[],
			amountTitles:['库存量','周销量','平均售价','周成本'],
			rateTitles:['周毛利率','库销比','效率值','折扣'],
			amountDatas:{
				'库存量':[],
				'周销量':[],
				'平均售价':[],
				'周成本':[],
			},
			rateDatas:{
				'周毛利率':[],
				'库销比':[],
				'效率值':[],
				'折扣':[],
			},
		},
		created() {
			this.sku = this.$route.params['sku']
		},

		methods:{

			async getDailyReportBySku(sku) {
				var self = this
				try {
					var res = await Http.requestAsync({
						url:'/dailyReport/getBeforeFrouWeekCurrentStockBySku',
						data:{
							sku,
						}
					})
					self.checkDataExists(res.data)
					self.buildDataResult(res.data)
					// console.log('res',res.data)
				} catch(e) {
					// console.log(e)
					throw new Error(e)
				}
			},

			checkDataExists(datas) {
				var dataValues = Object.values(datas)
				// console.log('@@@',dataValues)
				var result = []
				dataValues.forEach((data,i)=>{
					result.concat(data)
				})
				console.log('@@@@@',result)
			},

			buildDataResult(datas) {
				var self = this
				var titles = Object.keys(datas);
				let res = {}
				res[this.sku] = ['库存量','周销量','周毛利率','平均售价','库销比','效率值','折扣','周成本']
				for (let weekIdx in datas) {
					let data = datas[weekIdx]
					let count = data.length
					let buildIdx = `近${weekIdx[0]}周`;
					res[buildIdx] = {}
					// 牌价
					let brand_price = 0
					// 库存总合
					let totalSum = 0
					// 毛利总计
					let maoriSum = 0
					// 零售总量
					let retailSum = 0
					// 周零售价总额
					let retailPriceSum = 0

					let retailPriceAmount = 0
					// 加权成本总额
					let costJiaquanSum = 0

					data.forEach((v,dataIdx)=>{
						v['cost_info'] = JSON.parse(v['cost_info']);
						v['distribution_info'] = JSON.parse(v['distribution_info']);
						totalSum+=v['total'];
						maoriSum+=parseFloat(v['maori'])
						brand_price = v['brand_price']
						retailSum+=v['retail']
						retailPriceSum+=parseFloat(v['retail_price'])/v['retail']
						retailPriceAmount += parseFloat(v['retail_price']);
						costJiaquanSum+=parseFloat(v['cost_info']['cost_jiaquan'])
					})
					// 库存周平均值
					let totalAve = parseInt(totalSum/count)
					// 周毛利率
					let maoriRate = (maoriSum/retailPriceAmount).toFixed(5)
					// 周零售销售价平均值
					let retailPriceAve = retailPriceSum/count
					// 周加权成本平均值
					let costJiaquanAve = costJiaquanSum/count

					res[buildIdx]['库存量'] = totalAve
					res[buildIdx]['周销量'] = retailSum
					res[buildIdx]['周毛利率'] = (maoriRate*100).toFixed(4)
					res[buildIdx]['平均售价'] = retailPriceAve.toFixed(4)
					res[buildIdx]['库销比'] = (totalAve/(retailSum*4)).toFixed(4)
					res[buildIdx]['效率值'] = ((retailSum/totalAve)*maoriRate/0.0125*100).toFixed(4)
					res[buildIdx]['折扣'] = ((retailPriceAve/brand_price).toFixed(4))*10
					res[buildIdx]['周成本'] = costJiaquanAve.toFixed(4)

				}
				var titles = res[self.sku]
				delete res[self.sku]
				var dates = Object.keys(res)
				self.dates = dates.reverse()
				for(let i in res) {
					let data = res[i]
					Object.keys(data).forEach((k,i)=>{
						if(self.amountDatas.hasOwnProperty(k)) {
							self.amountDatas[k].unshift(data[k])
						}
						if(self.rateDatas.hasOwnProperty(k)) {
							self.rateDatas[k].unshift(data[k])
						}
					})
				}
				// 开始调用echars的图形方法
				this.setAmountLineOption()
				this.setBarByMaoriRateOption()
				this.setBarByStockAndRetailRateOption()
				this.setBarByEfficiencyValuesOption()
				this.setBarByDiscountOption()
			},

			setAmountLineOption() {
				var self = this
				this.amountLineOption = {
				    title: {
				        text: `货号:${self.sku}`
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:self.amountTitles
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: self.dates
				    },

				    yAxis: {
				        type: 'value'
				    },

				    series: [
				        {
				            name:'库存量',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.3
				            },
				            data:self.amountDatas['库存量']
				        },
				        {
				            name:'周销量',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.7
				            },
				            data:self.amountDatas['周销量']
				        },
				        {
				            name:'平均售价',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.1
				            },
				            data:self.amountDatas['平均售价']
				        },
				        {
				            name:'周成本',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.1
				            },
				            data:self.amountDatas['周成本']
				        },
				    ],

				    "color": ["#00C3B6", "#F46565", "#6FA6CD", "#414A52"]
				};

			},

			setBarByMaoriRateOption() {

				this.barByMaoriRateOption = {

					title: {
				        text: '毛利率'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : this.dates
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],

				    series : [
				        {
				            name:'周毛利率',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
				                    fontSize:10
				                }
				            },
				            data:this.rateDatas['周毛利率']
				        },

				    ],
				    "color": ["#F46565"]
				};
			},


			setBarByStockAndRetailRateOption(){

				this.barByStockAndRetailRateOption = {

					title: {
				        text: '库销比'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : this.dates
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],

				    series : [
				        {
				            name:'库销比',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
				                    fontSize:10
				                }
				            },
				            data:this.rateDatas['库销比']
				        },

				    ],
				    "color": ["#F46565"]
				};


			},

			setBarByEfficiencyValuesOption() {

				this.barByEfficiencyValuesOption = {

					title: {
				        text: '效率值'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : this.dates
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],

				    series : [
				        {
				            name:'效率值',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
				                    fontSize:10
				                }
				            },
				            data:this.rateDatas['效率值']
				        },

				    ],
				    "color": ["#F46565"]
				};


			},

			setBarByDiscountOption() {

				this.barByDiscountOption = {

					title: {
				        text: '折扣'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : this.dates
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],

				    series : [
				        {
				            name:'折扣',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
				                    fontSize:10
				                }
				            },
				            data:this.rateDatas['折扣']
				        },

				    ],
				    "color": ["#F46565"]
				};

			},


		},

		components:{
			ECharts,
		},

		watch:{
			'sku':function(newSku) {
				this.getDailyReportBySku(newSku);
			}
		}
	})
</script>

<style scoped>
	#DailyReportCurrentStockList{
		position:absolute;
		width: 100%;
		top: 0;
		left: 0;
		/*background: #FDF5E6;*/
	}
</style>