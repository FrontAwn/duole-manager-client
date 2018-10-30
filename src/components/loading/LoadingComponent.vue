<template>
	<div id="LoadingComponent" :style="{opacity,zIndex}" :class="transition ? 'container-transition' : ''">
		<div class="container">LOADING...</div>
	</div>
</template>

<script type="text/javascript">
	import Emitter from "@/utils/Emitter"
	import {vuec} from "vuec"

	export default vuec({
		name:"LoadingComponent",
		namespace:"LoadingComponent",
		vuex:true,
		states:['pageCache','pageState','zIndex','opacity','transition'],
	})
</script>

<style scoped>
	#LoadingComponent {
		position: fixed;
		width: 100%;
		height: 100%;
		background:#fff;
	}

	.container-transition {
		transition: opacity 0.5s;
	}

	.container{
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color:#28282E; 
		font-size:20px;
		font-weight: bold;
	}
</style>



