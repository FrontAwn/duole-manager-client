<template>
	<div id="ClientLeftMenu">
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
	import ClientLeftMenuModule from "@/vuex/modules/client/ClientLeftMenu"
	export default vuec({
		name:"ClientLeftMenu",
		namespace:"Client/ClientLeftMenu",
		vuex:true,
		modules:{
			"Client/ClientLeftMenu":ClientLeftMenuModule
		},
		states:['datas','values','status'],
		actions:['initRouterPage','spikRouterPage'],

		created() {
			this.initRouterPage()
		},

	})

</script>

<style scoped>
	#ClientLeftMenu {
		width: 100%;
		height: 100%;
	}
</style>