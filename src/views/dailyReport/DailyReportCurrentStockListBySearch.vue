<template>
	<div id="DailyReportCurrentStockListBySearch">

		<div 
			class="admin-component-inner-box" 
			v-if="!show && sku !==''"
			style="margin-top: 30px;" 
		>
			<span style="font-size: 14px;">货号<span style="color: #F46565">"{{sku}}"</span>没有找到日报现货数据</span>
		</div>



		<div class="admin-component-inner-box" v-if="show">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					合计
				</div>

				<div slot="extra">
					数据截止日期：{{lastDate}}
				</div>


				<div class="total-table-ver-box">
					<div style="display: flex;">
						<div 
						v-for="key in Object.keys(datas.totalDatas)"
							style="width:100%;display: flex;justify-content: center;align-items:center;background: #e9eaec;height: 35px;"
							:class="key==='折扣'?'title-table-border-end':'title-table-border'"
						>
							{{key}}
						</div>
					</div>
					

					<div style="display: flex;">
						<div 
							v-for="(val,idx) in Object.values(datas.totalDatas)"
							style="width:100%;display: flex;justify-content: center;align-items:center;height: 35px;" 
							:class="idx===Object.values(datas.totalDatas).length-1?'content-table-border-end':'content-table-border'"
						>
							{{val}}
						</div>
					</div>
				</div>


				<div class="total-table-hor-box">
					<div 
						v-for="(data,key) in datas.totalDatas"
						style="display: flex;width: 100%;" 
					>
						<div 
							style="width: 50%;height: 35px;display: flex;justify-content: center;align-items:center;background:#e9eaec"
							:class="key==='折扣'?'total-table-hor-table-title-border-end':'total-table-hor-table-title-border'"
						>{{key}}</div>

						<div 
							style="width: 50%;height: 35px;display: flex;justify-content: center;align-items:center"
							:class="key==='折扣'?'total-table-hor-table-content-border-end':'total-table-hor-table-content-border'"
						>{{data}}</div>
					</div>
				</div>

					
			</Card>
		</div>




		<div class="admin-component-inner-box" v-if="show">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					图形统计
				</div>

				<div slot="extra">
					数据截止日期：{{lastDate}}
				</div>

				<div style="width: 100%;display: flex;flex-wrap:wrap; ">
					<ECharts :options="amountLineByStockOption" class="echarts-image-container"></ECharts>
					<ECharts :options="amountLineByRetailOption" class="echarts-image-container"></ECharts>
					<ECharts :options="amountLineByRetailPriceOption" class="echarts-image-container"></ECharts>
					<ECharts :options="amountLineByCostOption" class="echarts-image-container"></ECharts>
					<ECharts :options="barByMaoriRateOption" class="echarts-image-container"></ECharts>
					<ECharts :options="barByStockAndRetailRateOption" class="echarts-image-container"></ECharts>
					<ECharts :options="barByEfficiencyValuesOption" class="echarts-image-container"></ECharts>
					<ECharts :options="barByDiscountOption" class="echarts-image-container"></ECharts>
				</div>

			</Card>
		</div>

		<div style="height: 100px;"></div>

	</div>
</template>

<script type="text/javascript">
	import Vue from "vue";
	import iView from "iview";
	import 'iview/dist/styles/iview.css';
	import '@/assets/less/theme.less';
	import "@/assets/css/admin.css";
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	import {dailyReportCurrentStockComputed} from "@/api/DailyReport"
	import ECharts from 'vue-echarts/components/ECharts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/title'
	Vue.use(iView);
	export default vuec({
		name:'DailyReportCurrentStockListBySearch',
		data:{
			sku:"",
			lastDate:'',
			datas:{},
			show:false,

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
		},

		mounted(){
			this.sku = '908978-001'
		},

		methods:{
			async getDatas() {
				var self = this
				try {
					var res = await Http.requestAsync({
						url:'/dailyReport/getBeforeFrouWeekCurrentStockBySku',
						data:{
							sku:self.sku,
						}
					})
					self.lastDate = res.data['lastDate']
					delete res.data['lastDate'];
					if ( !self.dataExists(res.data) ) {
						self.show = false
						return
					}
					self.show = true;
					var datas = dailyReportCurrentStockComputed(res.data)
					datas.titles.unshift('')
					self.datas = datas
					console.log(self.datas)
					self.setEchartsOptions()
				} catch(e) {
					throw new Error(e)
				}
			},

			dataExists(datas) {
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

			setEchartsOptions() {
				var datas = JSON.parse(JSON.stringify(this.datas))
				datas.titles.shift()

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
				            data : datas.titles
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
				            data:datas.amountDatas['库存量']
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
				            data : datas.titles
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
				            data:datas.amountDatas['周销量']
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
				            data : datas.titles
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
				            data:datas.amountDatas['平均售价']
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
				            data : datas.titles
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
				            data:datas.amountDatas['周成本']
				        },

				    ],
				    "color": ["#F46565"]
				};

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
				            data : datas.titles
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
				            data:datas.rateDatas['周毛利率']
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
				            data : datas.titles
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
				            data:datas.rateDatas['库销比']
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
				            data : datas.titles
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
				            data:datas.rateDatas['效率值']
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
				            data : datas.titles
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
				            data:datas.rateDatas['折扣']
				        },

				    ],
				    "color": ["#F46565"]
				};


			},

		},

		watch:{
			'sku':function(){
				this.getDatas()
			}
		},

		components:{
			ECharts,
		}
	})
</script>

<style scoped>

	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);
	@custom-media --small (max-width: 580px);


	.title-table-style {
		width: 20%;height: 35px;
		display:flex;align-items:center;
		justify-content:center;background: #e9eaec;
		color:#414A52
	}

	.title-table-border {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}	

	.title-table-border-end {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.content-table-style {
		width: 20%;height: 35px;
		display:flex;align-items:center;
		justify-content:center;color:#414A52
	}

	.content-table-border {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.content-table-border-end {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.echarts-image-container {
		width: 50%;
		width:100% ?if media (--phone);
	}


	.total-table-ver-box{
		width: 100%;
		display: none ?if media (--small);

	}

	.total-table-hor-box {
		display: none;
		width: 100%;
		display: block ?if media (--small);
	}

	.total-table-hor-table-title-border {
		border-top: 1px solid #dddee1;
		border-left: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.total-table-hor-table-title-border-end {
		border-top: 1px solid #dddee1;
		border-left: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.total-table-hor-table-content-border {
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.total-table-hor-table-content-border-end {
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

</style>