<template>
	<div id="Client">

		<div style="width: 100%;height: 100%;overflow: hidden;display: flex;">
			<div id="menu">
				<ClientLeftMenu></ClientLeftMenu>
			</div>

			<div id="content">
				<!-- <div id="content-header"> -->
					<!-- <ClientHeader></ClientHeader> -->
				<!-- </div> -->
				<div id="content-info">
					<keep-alive :include="includedCacheComponents">
						<router-view></router-view>
					</keep-alive>	
				</div>
				
			</div>
		</div>

	</div>

</template>

<script>
	
	import 'iview/dist/styles/iview.css';
	import '@/assets/less/theme.less';
	import "@/assets/css/admin.css";
	import {vuec} from "vuec";
	import Vue from "vue";
	import iView from "iview";
	Vue.use(iView);

	import ClientHeader from "./client/ClientHeader";
	import ClientLeftMenu from "./client/ClientLeftMenu";

	export default vuec({
		name:"Client",
		data:{
			includedCacheComponents:[
			],
		},
		mounted() {
			console.log(this.$store)
		},
		components:{
			ClientHeader,
			ClientLeftMenu
		}
	})


</script>

<style scoped>
	
	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);

	#Client {
		position:fixed;
		top: 0;
		left:0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}


	#header-left {
		width: 220px;
		height: 100%;
		display: none ?if media (--ipad);
		display: none ?if media (--phone);
	}

	#header-content {
		width: 100%;
		height: 100%;
	}

	#menu {
		width: 220px;
		height: 100%;
		overflow: auto;
		display: none ?if media (--ipad);
		display: none ?if media (--phone);
	}

	#content{
		width: 100%;
		max-height:100%;
		background: #FBFBFB;
		/*background: #FFFFFF;*/
	}

	#content-header {
		width: 100%;
		height: 60px;
		z-index: 300;
	}

	#content-info {
		width: 100%;
		height: 100%;
		overflow: auto;
		/*margin-top: 1px;*/
	}


</style>