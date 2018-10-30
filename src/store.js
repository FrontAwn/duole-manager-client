import Vue from 'vue'
import Vuex from 'vuex'

import state from "@/vuex/states"
import getters from "@/vuex/getters"
import mutations from "@/vuex/mutations"
import actions from "@/vuex/actions"
import LoadingComponent from "@/vuex/modules/components/LoadingComponent"
import App from "@/vuex/modules/app/App"

Vue.use(Vuex)

const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules:{
		LoadingComponent,
		App,
	},
})

export default store;