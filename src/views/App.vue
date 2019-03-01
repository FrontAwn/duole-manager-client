<template>
	<div>
		<transition name="transfer">
			<keep-alive :include="includedCacheComponents">
					<router-view></router-view>	
			</keep-alive>
		</transition>
	</div>
</template>

<script>
	import {vuec} from "vuec"

	export default vuec({
		name:"App",
		data:{
			isLoading:true,
			includedCacheComponents:[],
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