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
	export default vuec({
		name:"ClientLeftMenu",
		data:{
			datas:{
				menuList:{
					'日报':[
						{name:"DailyReportCurrentStockUpload",label:"日报现货表上传",icon:"social-buffer"},
						{name:"DailyReportCurrentStockSearch",label:"日报现货表查询",icon:"social-buffer"},
					],

					'毒App':[
						{name:"DuAppSkuDetailExport",label:"导出数据",icon:"social-buffer"},
						
					],
				},
			},
			values:{
				initComponent:"DailyReportCurrentStockUpload",
				selectComponent:"DailyReportCurrentStockUpload"
			}
		},

		created() {
			this.initRouterPage()
		},

		methods:{
			initRouterPage() {
				if( window.location.pathname === '/' ) {
					this.$router.push({name:this.values.initComponent});
				} else {
					var name = this.$route.name
					this.spikRouterPage(name)
				}
			},

			spikRouterPage(component) {
				this.$router.push({name:component});
				this.changeSelectComponentState(component)
			},

			changeSelectComponentState(name) {
				this.values.selectComponent = name;
			}

		}

	})

</script>

<style scoped>
	#ClientLeftMenu {
		width: 100%;
		height: 100%;
	}
</style>