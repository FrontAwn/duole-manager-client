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

	// {
	// 	path: '/admin',
	// 	name: 'Admin',
	// 	component:Admin,
	// 	children: [
	// 		{path:'word/store',name:"WordStoreComponent",component:WordStoreComponent},
	// 		{path:'sentence/store',name:"SentenceStoreComponent",component:SentenceStoreComponent},
	// 		{path:'article/store',name:"ArticleStoreComponent",component:ArticleStoreComponent},
	// 		{path:'grammar/store',name:"GrammarStoreComponent",component:GrammarStoreComponent},
	// 		{path:'course/store',name:"CourseStoreComponent",component:CourseStoreComponent},
	// 		{path:'course/question/store',name:"CourseQuestionStoreComponent",component:CourseQuestionStoreComponent},
	// 		{path:'test/course',name:"TestCourseComponent",component:TestCourseComponent},
	// 		{path:'test/english/word',name:"TestEnglishWordComponent",component:TestEnglishWordComponent},
	// 		{path:'test/question',name:"TestCourseQuestionComponent",component:TestCourseQuestionComponent}
	// 	]
	// }

]

const router = new Router({
	mode: 'history',
	routes
})

export default router
