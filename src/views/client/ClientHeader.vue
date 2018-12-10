<template>
	<div id="ClientHeader">
		<!-- <img :src="logo" id="admin-header-component-logo-box">
		</img> -->
		<div id="admin-header-component-logo-title">Duole Manager</div>
	</div>
</template>

<script>
	import {vuec} from "vuec" 
	import logo from "@/assets/images/logo/duole.jpeg"

	export default vuec({
		name:"ClientHeader",
		data:{
			logo,
		}
	})

</script>

<style scoped>
	
	#ClientHeader {
		width: 100%;
		height: 100%;
		display: flex;
		background: #FFFFFF;
		align-items: center;
		/*box-shadow: 0px 1px 8px #dddee1;*/
		border-bottom: 1px solid #dddee1;
		z-index: 500 !important;
	}

	#admin-header-component-logo-box {
		width: 45px;
		height: 45px;
		margin-left: 30px;
		border-radius: 100%;
		box-shadow:1px 1px 3px #cdcdcd;
	}

	#admin-header-component-logo-title {
		margin-left: 25px;
		font-size: 22px;
		font-family: "Mouser";
		color:#495060;
		margin-top: 1px;
	}

</style>







