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

const DuAppSkuSave = ()=>import('@/views/client/DuAppSkuSave');
const DuAppSkuListByExcept = ()=>import('@/views/client/DuAppSkuListByExcept')
const DuAppSkuDetailExport = ()=>import('@/views/client/DuAppSkuDetailExport')

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
	    		path:'duapp/skuSave',
	    		name:'DuAppSkuSave',
	    		component:DuAppSkuSave,
	    	},

	    	{
	    		path:'duapp/skuListByExcept',
	    		name:'DuAppSkuListByExcept',
	    		component:DuAppSkuListByExcept
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
		path:"/dailyReport/currentStockListBy/search",
		name:"DailyReportCurrentStockListBySearch",
		component:DailyReportCurrentStockListBySearch
	},

]

const router = new Router({
	mode: 'history',
	routes
})

export default router
