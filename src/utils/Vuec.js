import Emitter from "@/utils/Emitter"
import Vue from "vue";
import {mapGetters,mapState,mapMutations,mapActions} from 'vuex'
import {isEmptyObj} from "utils"
import store from "@/store";

class Vuec {

	static vuec(ops) {
		if(typeof ops !== 'object') throw new Error('VuecFunctionError:方法参数只接受object类型');
		if(ops.vuex && typeof ops.vuex !== 'boolean') throw new Error('VuecFunctionError:如果组建使用vuex请把vuex属性传值true，否则传值false');
		if(!ops.name) throw new Error('VuecFunctionError:请设定组建的name属性');
		ops.namespace = ops.namespace ? ops.namespace : null
		ops.vuex = ops.vuex ? ops.vuex : false;
		if(ops.namespace === null && ops.vuex === true) {
			throw new Error('VuecFunctionError:如果使用vuex属性为true时，必须定义namespace属性');
		}

		//LoadingComponent组件依赖
		// ops.loadingCache = ops.loadingCache ? ops.loadingCache : false;
		// ops.loaded = ops.loaded ? ops.loaded : false;

		// 属性
		ops.data = ops.data ? ops.data : {}
		ops.props = ops.props ? ops.props : []
		ops.computed = ops.computed ? ops.computed : {}
		ops.methods = ops.methods ? ops.methods : {}
		ops.components = ops.components ? ops.components : {}
		ops.filters = ops.filters ? ops.filters : {}
		ops.watch = ops.watch ? ops.watch : {}
		ops.events = ops.events ? ops.events : [] 

		// vuex
		ops.modules = ops.modules ? ops.modules : {}
		ops.unmodules = ops.unmodules ? ops.unmodules : false
		ops.getters = ops.getters ? ops.getters : [] 
		ops.mutations = ops.mutations ? ops.mutations : [] 
		ops.states = ops.states ? ops.states : [] 
		ops.actions = ops.actions ? ops.actions : [] 

		// 生命周期
		ops.beforeCreate = ops.beforeCreate ? ops.beforeCreate : ()=>{}
		ops.created = ops.created ? ops.created : ()=>{}
		ops.mounted = ops.mounted ? ops.mounted : ()=>{}
		ops.destroyed = ops.destroyed ? ops.destroyed : ()=>{}
		// keep-alive生命周期
		ops.activated = ops.activated ? ops.activated : ()=>{}
		ops.deactivated = ops.deactivated ? ops.deactivated : ()=>{}


		let beforeCreateLifecycle = function() {
			if( ops.vuex === true && ops.namespace !== null ) {
				this.$store.state[ops.namespace]['$self'] = this;
			}

			ops.beforeCreate.bind(this)()
		}

		let createdLifecycle = function(){
			if(ops.events.length > 0) {
				Emitter.on({
					obj:this,
					event:ops.events
				})
			}

			// if( ops.loadingCache === true && this.$store.state.App.isLoading === true) {
			// 	this.$store.dispatch("LoadingComponent/cache",ops.name);
			// }

			ops.created.bind(this)()
		}

		let mountedLifecycle = function(){
			// if( ops.loaded === true  && this.$store.state.App.isLoading === true) {
			// 	this.$store.dispatch("LoadingComponent/loaded");
			// } else {
			// 	console.log('如果loaded属性不为true时，请在恰当的时间调用this.$store.dispatch("LoadingComponent/loaded")函数来关闭loading组件')
			// }
			ops.mounted.bind(this)()
		}

		let destroyedLifecycle = function(){
			if(ops.events.length > 0) {
				Emitter.off(this)
			}

			if(ops.unmodules === true && ops.vuex === true && !isEmptyObj(ops.modules)) {
				for(let key in ops.modules) {
					let module = ops.modules[key];
					this.$store.unregisterModule(key);
				}
			}

			ops.destroyed.bind(this)()
		}

		let activatedLifecycle = function() {
			ops.activated.bind(this)()
		}

		let deactivatedLifecycle = function() {
			ops.deactivated.bind(this)()
		}


		function setVuexComputeProperties() {
			let mapStateObj = {}
			let mapGettersObj = {}
			if(ops.states.length > 0) mapStateObj = mapState(ops.namespace,ops.states)
			if(ops.getters.length > 0) mapGettersObj = mapGetters(ops.namespace,ops.getters)
			return {...mapStateObj,...mapGettersObj};
		}

		function setVuexMethodProperties() {
			let mapMutationsObj = {}
			let mapActionsObj = {}
			if(ops.mutations.length > 0) mapMutationsObj = mapMutations(ops.namespace,ops.mutations)
			if(ops.actions.length > 0) mapActionsObj = mapActions(ops.namespace,ops.actions)
			return {...mapMutationsObj,...mapActionsObj} 
		}


		if(ops.vuex === true && !isEmptyObj(ops.modules)) {
			for(let key in ops.modules) {
				let module = ops.modules[key];
				store.registerModule(key,module);
			}
		}

		let computeProperties = {}
		let methodPropertyies = {}

		if( ops.vuex === true ) {
			computeProperties = {
				...setVuexComputeProperties(),
				...ops.computed
			}

			methodPropertyies = {
				...setVuexMethodProperties(),
				...ops.methods
			}
		} else {
			computeProperties = ops.computed
			methodPropertyies = ops.methods
		}


		let obj = {
			name:ops.name,
			props:ops.props,
			data() {
				return ops.data
			},
			beforeCreate:beforeCreateLifecycle,
			created:createdLifecycle,
			mounted:mountedLifecycle,
			activated:activatedLifecycle,
			deactivated:deactivatedLifecycle,
			destroyed:destroyedLifecycle,
			computed:computeProperties,
			methods:methodPropertyies,
			components:ops.components,
			watch:ops.watch,
			filters:ops.filters,
		}

		return obj

	}

}

export default Vuec;

let {vuec} = Vuec;

export {vuec}








