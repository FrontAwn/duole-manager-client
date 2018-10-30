export default {

	namespaced:true,
	
	state:{
		pageCache:[],

		loadingState:true,

		zIndex:9999,

		opacity:0.9,

		transition:false
	},
	actions:{
		cache({state,commit},pageName=null) {
			if( state.pageCache.includes(pageName) || pageName === null ) return;
			commit('addCachePage',pageName);
		},

		router({state,commit},pageName=null) {
			if( state.pageCache.includes(pageName) || pageName === null || state.loadingState) return;
			commit('openLoading')
		},

		loaded({state,commit}) {
			if ( !state.loadingState ) return;
			commit('closeLoading')
		}
	},
	mutations:{
		openLoading(state) {
			state.loadingState = true
			state.transition = false
			state.opacity = 0.9
			state.zIndex = 9999
			
		},

		closeLoading(state) {
			state.loadingState = false
			state.transition = true
			state.opacity = 0
			state.zIndex = 0
		},

		addCachePage(state,pageName) {
			state.pageCache.push(pageName);
		}
	}

}