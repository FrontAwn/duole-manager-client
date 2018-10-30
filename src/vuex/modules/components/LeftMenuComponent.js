
export default {
	namespaced:true,
	state: {
		datas:{

			menuList:{
				'上传':[
					{name:"UploadExcelComponent",label:"日报上传",icon:"social-buffer"},
				],
			},
		},

		values:{
			initComponent:"UploadExcelComponent",
			selectComponent:"UploadExcelComponent"
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