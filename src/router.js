import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = ()=>import('@/views/index/Index');
const UploadExcelComponent = ()=>import('@/views/index/UploadExcelComponent')

//日报处理
const DailyReportCurrentStockList = ()=>import('@/views/dailyReport/DailyReportCurrentStockList');

const routes = [

	{
		path: '/',
	    name: 'Index',
	    component: Index,
	    children:[
	    	{
	    		path:'upload/excel',
	    		name:"UploadExcelComponent",
	    		component:UploadExcelComponent
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
