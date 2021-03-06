import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Client = ()=>import('@/views/Client');
// 日报现货表上传
const DailyReportCurrentStockUpload = ()=>import('@/views/client/DailyReportCurrentStockUpload')
// 日报根据sku查看现货表计算数据
const DailyReportCurrentStockList = ()=>import('@/views/dailyReport/DailyReportCurrentStockList');
const DailyReportCurrentStockListBySearch = ()=>import('@/views/dailyReport/DailyReportCurrentStockListBySearch');
// 日报筛选页面
const DailyReportCurrentStockSearch = ()=>import('@/views/client/DailyReportCurrentStockSearch')

// duapp

const DuAppSkuDetailExport = ()=>import('@/views/client/DuAppSkuDetailExport')

// www.nike.net
const NikeStockList = ()=>import('@/views/nike/NikeStockList')

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

	    	{
	    		path:'duapp/skuDetailExport',
	    		name:'DuAppSkuDetailExport',
	    		component:DuAppSkuDetailExport
	    	},


	    ]
	},

	{
		path:'/dailyReport/currentStockList/:sku',
		name:'DailyReportCurrentStockList',
		component:DailyReportCurrentStockList
	},

	{
		path:"/dailyReport/currentStockListBy/search/:sku",
		name:"DailyReportCurrentStockListBySearch",
		component:DailyReportCurrentStockListBySearch
	},


	{
		path:'/nike/stock/list',
		name:'NikeStockList',
		component:NikeStockList
	},

	{
		path:'/nike/stock/list/:conditions',
		name:'NikeStockList',
		component:NikeStockList
	},

]

const router = new Router({
	mode: 'history',
	routes
})

export default router
