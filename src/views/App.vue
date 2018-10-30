<template>
	<div>
		<!-- <LoadingComponent v-if="isLoading"></LoadingComponent> -->
		<transition name="transfer">
			<keep-alive :include="includedCacheComponents">
					<router-view></router-view>	
			</keep-alive>
		</transition>
	</div>
</template>

<script>
	import LoadingComponent from '@/components/loading/LoadingComponent'
	import {vuec} from "vuec"

	export default vuec({
		name:"App",
		namespace:"App",
		loadingCache:false,
		loaded:false,
		vuex:true,
		states:['isLoading','includedCacheComponents'],
		components:{
			LoadingComponent,
		}
	})
</script>

<style scoped>
	.transfer-leave-active, .transfer-enter-active{
		transition: all 0.5s;
	}

	.transfer-leave-to{
		/*transform: translateY(5px);*/
		opacity: 0;
	}

	.transfer-enter-to{
		/*transform: translateY(0px);*/
	}

	.transfer-enter {
		/*transform: translateY(5px);*/
		opacity: 0;
	}
</style>