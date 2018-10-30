<template>
	<div id="Drawer" :style="drawerTranslate">
		<div id="drawer-core-inner-box">
			<div id="drawer-title-box" v-if="showTitle">
				<div><slot name="title"></slot></div>
				<div><slot name="title-extra"></slot></div>
			</div>

			<div id="drawer-content-box">
				<slot name="content"></slot>
			</div>

			<div id="drawer-footer-box" v-if="showFooter">
				<div><slot name="footer"></slot></div>
				<div><slot name="footer-extra"></slot></div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import {vuec} from "vuec";
	import closeIcon from "@/assets/images/icon/close_light.svg"
	export default vuec({
		name:"Drawer",
		vuex:false,
		props:{
			showTitle:{
				type:Boolean,
				default:true,
			},
			showFooter:{
				type:Boolean,
				default:true,
			},
			value:{
				type:Boolean,
				default:false
			},
		},

		data:{
			closeIcon,
			translateX:5000,
		},

		computed:{
			drawerTranslate(){
				if(this.value) {
					this.translateX = 0
				} else {
					this.translateX = 5000
				}
				return {
					"transform":`translate3d(${this.translateX}px,0px,0px)`,
				}
			},
		},
	})
</script>

<style scoped>

	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);

	#Drawer {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		position:absolute;
		z-index: 3000;
		top:0;
		left:0;
		transition: all 0.5s;
	}

	#drawer-core-inner-box {
		width: 800px;
		width:600px ?if media (--ipad);
		width:1000px ?if media (--large);
		max-width: 90%;
	}

	#drawer-title-box {
		width: 100%;
		display: flex;
		height: 50px;
		margin-top: 20px;
		border-bottom: 1px solid #e9eaec;
		justify-content: space-between;
		align-items: center;
	}

	#drawer-content-box {
		margin-top: 15px;
	}

	#drawer-footer-box {
		width: 100%;
		display: flex;
		height: 50px;
		margin-top: 20px;
		border-top: 1px solid #e9eaec;
		justify-content: space-between;
		align-items: center;
	}

	
</style>








