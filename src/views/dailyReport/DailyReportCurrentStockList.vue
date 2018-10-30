<template>
	<div id="DailyReportCurrentStockList">
		<!-- <div style="width: 100%;display: flex;">
			<div v-for="(datas,title) in result" style="width: 20%;">
				<div style="height: 40px;width: 100%;display: flex;justify-content: center;align-items: center;border:1px solid #dddee1;background: #e9eaec;">{{title}}</div>
				<div v-for="(data,opt) in datas" style="height: 40px;width: 100%;display: flex;justify-content: center;align-items: center;border-right:1px solid #dddee1;border-bottom: 1px solid #dddee1;">{{data}}</div>
			</div>	
		</div> -->
		<div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
			<div style="width: 80%">
				<ECharts :options="amountOption" style="width: 100%;"></ECharts>
			</div>
		</div>
		<div style="height:30px;"></div>
		<div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
			<div style="width: 80%">
				<ECharts :options="rateOption" style="width: 100%;"></ECharts>
			</div>
		</div>
		<div style="height:30px;"></div>
	</div>
</template>

<script type="text/javascript">
	import { vuec } from 'vuec'
	import Http from "@/utils/Http"
	import ECharts from 'vue-echarts/components/ECharts'
	import 'echarts'
	// import 'echarts/lib/component/polar'

	export default vuec({
		name:'DailyReportCurrentStockList',
		data:{
			sku:null,
			result:{},
			amountOption:{},
			rateOption:{}

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
					self.buildDataResult(res.data)
					console.log('res',res.data)
				} catch(e) {
					// console.log(e)
					throw new Error(e)
				}
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

					// console.log('毛利总计',maoriSum);
					// console.log('销售金额总计',retailPriceAmount);

					res[buildIdx]['库存量'] = totalAve
					res[buildIdx]['周销量'] = retailSum
					res[buildIdx]['周毛利率'] = (maoriRate*100).toFixed(4)
					res[buildIdx]['平均售价'] = retailPriceAve.toFixed(4)
					res[buildIdx]['库销比'] = (totalAve/(retailSum*4)).toFixed(4)
					res[buildIdx]['效率值'] = ((retailSum/totalAve)*maoriRate/0.0125*100).toFixed(4)
					res[buildIdx]['折扣'] = (retailPriceAve/brand_price).toFixed(4)
					res[buildIdx]['周成本'] = costJiaquanAve.toFixed(4)

				}

				this.result = res
				this.setEchartsOptions()
			},

			setEchartsOptions() {
				var self = this
				var res = self.result
				var titles = res[self.sku]
				delete res[self.sku]
				var dates = Object.keys(res)
				var amountTitles = ['库存量','周销量','平均售价','周成本'] 
				var amountDatas = {
					'库存量':[],
					'周销量':[],
					'平均售价':[],
					'周成本':[],
				}
				var rateTitles = ['周毛利率','库销比','效率值','折扣']
				var rateDatas = {
					'周毛利率':[],
					'库销比':[],
					'效率值':[],
					'折扣':[],	
				}
		

				for(let i in res) {
					let data = res[i]
					Object.keys(data).forEach((k,i)=>{
						if(amountDatas.hasOwnProperty(k)) {
							amountDatas[k].push(data[k])
						}
						if(rateDatas.hasOwnProperty(k)) {
							rateDatas[k].push(data[k])
						}
					})
				}
				// console.log('###',details)

				this.amountOption = {
				    title: {
				        text: `货号:${self.sku}`
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:amountTitles
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
				        data: dates
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
				            data:amountDatas['库存量']
				        },
				        {
				            name:'周销量',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.7
				            },
				            data:amountDatas['周销量']
				        },
				        {
				            name:'平均售价',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.1
				            },
				            data:amountDatas['平均售价']
				        },
				        {
				            name:'周成本',
				            type:'line',
				            smooth: true,
				            areaStyle: {
				            	opacity:0.1
				            },
				            data:amountDatas['周成本']
				        },
				    ],

				    "color": ["#00C3B6", "#F46565", "#6FA6CD", "#414A52"]
				};



				this.rateOption = {
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        data:rateTitles,
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
				            data : dates
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
				            data:rateDatas['周毛利率']
				        },
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
				            data:rateDatas['效率值']
				            
				        },
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
				            data:rateDatas['库销比']
				        },
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
				            data:rateDatas['折扣']
				  		},
				    ],
				    "color": ["#00C3B6", "#F46565", "#6FA6CD", "#414A52"]
				};



			}


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