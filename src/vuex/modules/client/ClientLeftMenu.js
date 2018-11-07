
export default {
	namespaced:true,
	state: {
		datas:{

			menuList:{
				'上传':[
					{name:"DailyReportCurrentStockUpload",label:"日报现货表上传",icon:"social-buffer"},
				],

				'查询':[
					{name:"DailyReportCurrentStockSearch",label:"日报现货表查询",icon:"social-buffer"}
				],
			},
		},

		values:{
			initComponent:"DailyReportCurrentStockUpload",
			selectComponent:"DailyReportCurrentStockUpload"
		},

		status:{

		},
	},

	actions: {
		initRouterPage({rootState,state}) {
			if( rootState['$uri'] === '/' ) {
				rootState.$router.push({name:state.values.initComponent});
			} else {
				rootState.$router.push({path:rootState['$uri']});
			}
		},

		spikRouterPage({rootState,commit},component) {
			rootState.$router.push({name:component});
			commit('changeSelectComponentState',component);
		}

	},

	mutations: {
		changeSelectComponentState(state,name) {
			state.values.selectComponent = name;
		}
	}


}