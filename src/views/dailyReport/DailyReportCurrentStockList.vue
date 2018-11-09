<template>
	<div id="DailyReportCurrentStockList">

		<div style="display: flex;justify-content: center;font-size: 16px;font-weight: bold;border-bottom: 1px solid #dddee1;">日报数据截止日期：
				<span style="color: #F46565">{{lastDate}}</span>
			</div>
		<div style="display: flex;justify-content: center;align-items: center;margin-top: 30px;font-size: 16px;color: #F46565" v-if="!state">货号:‘{{sku}}’没有找到日报数据</div>
		<div style="width: 100%;height: 100%;display: flex;margin-top:20px;" v-if="state">
			<ECharts :options="amountLineByStockOption" style="width: 50%;"></ECharts>
			<ECharts :options="amountLineByRetailOption" style="width: 50%;"></ECharts>
			<ECharts :options="amountLineByRetailPriceOption" style="width: 50%;"></ECharts>
			<ECharts :options="amountLineByCostOption" style="width: 50%;"></ECharts>
		</div>
		<div style="width: 100%;height: 100%;display: flex;margin-top:30px;" v-if="state">
				<ECharts :options="barByMaoriRateOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByStockAndRetailRateOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByEfficiencyValuesOption" style="width: 50%;"></ECharts>
				<ECharts :options="barByDiscountOption" style="width: 50%;"></ECharts>
		</div>

		<div style="width: 100%;height: 100%;display: flex;margin-top:20px;justify-content: center;align-items: center;font-size:18px;font-weight: bold" v-if="state">
			总计
		</div>

		<div style="width: 100%;height: 100%;display: flex;margin-top:5px;justify-content: center;align-items: center;" v-if="state">
				<div v-for="(data,key) in totalDatas" style="display: flex;position:relative;">
					<div 
						style="width: 70px;height:50px;background:#e9eaec;display: flex;justify-content: center;align-items: center;font-size: 14px;"
						:class="key === '折扣' ? 'key-table-border-end' : 'key-table-border'"
					>{{key}}</div>
					<div 
						style="position: absolute;width: 70px;height:50px;display: flex;justify-content: center;align-items: center;top:50px;left:0;font-size: 14px;"
						:class="key === '折扣' ? 'value-table-border-end' : 'value-table-border'"
					>{{data}}</div>
				</div>	
		</div>
		<div style="height:100px;"></div>
	</div>
</template>

<script type="text/javascript">
	import { vuec } from 'vuec'
	import Http from "@/utils/Http"
	import ECharts from 'vue-echarts/components/ECharts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/title'
	import {dailyReportCurrentStockComputed} from "@/api/DailyReport"

	export default vuec({
		name:'DailyReportCurrentStockList',
		data:{
			state:true,
			sku:null,
			// 库存量
			amountLineByStockOption:{},
			// 周销量
			amountLineByRetailOption:{},
			// 平均售价
			amountLineByRetailPriceOption:{},
			// 周成本
			amountLineByCostOption:{},
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
			totalDatas:{},
			lastDate:'',
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
					self.lastDate = res.data['lastDate']
					delete res.data['lastDate'];
					
					if( !self.checkDataExists(res.data) ) {
						this.state = false
						return;
					}
					this.state = true
					var datas = dailyReportCurrentStockComputed(res.data)
					self.amountDatas = datas['amountDatas']
					self.rateDatas = datas['rateDatas']
					self.totalDatas = datas['totalDatas']
					self.dates = datas['titles']
					this.setAmountLineOption()
					this.setRateBarOption()
				} catch(e) {
					throw new Error(e)
				}
			},

			checkDataExists(datas) {
				var dataValues = Object.values(datas)
				var result = []
				for(let i in dataValues) {
					result.push(dataValues[i].length)
				}
				var dataTotal = result.reduce((prev,curr)=>{
					return prev + curr
				})
				if( dataTotal === 0 ) {
					return false
				} else {
					return true
				}
			},

			setAmountLineOption() {
				this.amountLineByStockOption = {

					title: {
				        text: '库存量'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            
				            type : 'shadow'        
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
				            name:'库存量',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.amountDatas['库存量']
				        },

				    ],
				    "color": ["#F46565"]
				};


				this.amountLineByRetailOption = {

					title: {
				        text: '周销量'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            
				            type : 'shadow'        
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
				            name:'周销量',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.amountDatas['周销量']
				        },

				    ],
				    "color": ["#F46565"]
				};


				this.amountLineByRetailPriceOption = {

					title: {
				        text: '平均售价'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            
				            type : 'shadow'        
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
				            name:'平均售价',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.amountDatas['平均售价']
				        },

				    ],
				    "color": ["#F46565"]
				};


				this.amountLineByCostOption = {

					title: {
				        text: '周成本'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            
				            type : 'shadow'        
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
				            name:'周成本',
				            type:'bar',
				            // barWidth : 30,
				            label: {
				                normal: {
				                    show: true,
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.amountDatas['周成本']
				        },

				    ],
				    "color": ["#F46565"]
				};


									

			},

			setRateBarOption() {

				this.barByMaoriRateOption = {

					title: {
				        text: '毛利率'
				    },

				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            
				            type : 'shadow'        
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
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.rateDatas['周毛利率']
				        },

				    ],
				    "color": ["#F46565"]
				};


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
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.rateDatas['库销比']
				        },

				    ],
				    "color": ["#F46565"]
				};


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
				                    fontSize:16,
				                    color:'#000000'
				                }
				            },
				            data:this.rateDatas['效率值']
				        },

				    ],
				    "color": ["#F46565"]
				};

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
				                    fontSize:16,
				                    color:'#000000'
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
	}

	.key-table-border {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
	}	

	.key-table-border-end {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.value-table-border {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
		border-top: 1px solid #dddee1;
	}

	.value-table-border-end {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}
</style>











