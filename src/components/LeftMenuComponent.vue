<template>
	<div id="LeftMenuComponent">
	 	<Menu  
		 	:active-name="values.selectComponent" 
		 	style="min-height: 100%;" 
		 	:width="'89%;'" 
		 	@on-select="spikRouterPage"
		 >
	        <MenuGroup 
	        	v-for="(menuItems,title) in datas.menuList" 
	        	:title="title" 
	        	:key="title"
	        >
	        	<MenuItem 
	        		v-for="(memuItem,key) in menuItems" 
	        		:name="memuItem.name" 
	        		:key="key" 
	        	>
	        		<Icon :type="memuItem.icon" />
	        		{{memuItem.label}}
	        	</MenuItem>
	        </MenuGroup>
	    </Menu>
	 </div>
</template>
<script>
	import {vuec} from "vuec";
	import LeftMenuComponentModule from "@/vuex/modules/components/LeftMenuComponent"
	export default vuec({
		name:"LeftMenuComponent",
		namespace:"Components/LeftMenuComponent",
		vuex:true,
		modules:{
			"Components/LeftMenuComponent":LeftMenuComponentModule
		},
		states:['datas','values','status'],
		actions:['initRouterPage','spikRouterPage'],

		created() {
			this.initRouterPage()
		},

	})

</script>

<style scoped>
	#LeftMenuComponent {
		width: 100%;
		height: 100%;
	}
</style>