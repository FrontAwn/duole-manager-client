
export default {
	namespaced:true,
	state: {
		datas:{

			menuList:{
				'日报':[
					{name:"DailyReportCurrentStockUpload",label:"日报现货表上传",icon:"social-buffer"},
					{name:"DailyReportCurrentStockSearch",label:"日报现货表查询",icon:"social-buffer"},
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
		initRouterPage({rootState,dispatch,state}) {
			if( rootState['$uri'] === '/' ) {
				rootState.$router.push({name:state.values.initComponent});
			} else {
				var name = state['$self'].$route.name
				dispatch('spikRouterPage',name)
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