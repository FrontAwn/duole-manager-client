import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Client = ()=>import('@/views/Client');
// 日报现货表上传
const DailyReportCurrentStockUpload = ()=>import('@/views/client/DailyReportCurrentStockUpload')
// 日报根据sku查看现货表计算数据
const DailyReportCurrentStockList = ()=>import('@/views/dailyReport/DailyReportCurrentStockList');
// 日报筛选页面
const DailyReportCurrentStockSearch = ()=>import('@/views/client/DailyReportCurrentStockSearch')

const routes = [

	{
		path: '/',
	    name: 'Client',
	    component: Client,
	    children:[
	    	{
	    		path:'dailyReport/currentStockUpload',
	    		name:"DailyReportCurrentStockUpload",
	    		component:DailyReportCurrentStockUpload
	    	},

	    	{
	    		path:'dailyReport/currentStockSearch',
	    		name:'DailyReportCurrentStockSearch',
	    		component:DailyReportCurrentStockSearch,
	    	},
	    ]
	},

	{
		path:'/dailyReport/currentStockList/:sku',
		name:'DailyReportCurrentStockList',
		component:DailyReportCurrentStockList
	}

]

const router = new Router({
	mode: 'history',
	routes
})

export default router
