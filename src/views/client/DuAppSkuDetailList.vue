<template>
	
	<div id="DuAppSkuDetailList">

		<div class="admin-component-inner-box">
			<div class="admin-iview-core-card">
				<div style="width: 100%;display: flex;justify-content: space-between;">
					<Input 
						v-model="search"
						icon="search"
						placeholder="请输入要搜索的货号..."
						style="width: 80%"
					></Input>

					<Button type="error" icon="archive" @click="exportDetails">导出数据</Button>
				</div>
			</div>
	 	</div>


	 	<div class="admin-component-inner-box">
	 		<Table 
	 			class="admin-iview-core-card"
        		border 
        		:columns="skuDetailsColumn" 
        		:data="skuDetails"
        		:loading="loading"
        	></Table>
        </div>

        <Modal
		    v-model="showSizeListModal"
		    :title="selectSku"
		>
			

		</Modal>


        <div style="height:150px;"></div>

	 </div>

</template>

<script>
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	import Event from "@/utils/Emitter"

	const SKIP_SKU = 4
	const EXCEPTION_STATE = 3
	const DEFAULT_OFFSET = 1

	export default vuec({
		name:'DuAppSkuDetailList',
		data:{
			showSizeListModal:false,
			loading:false,
			search:'',

			selectSku:'',
			selectIdx:'',
			selectSizeList:[],

			inputTargetName:'',
			inputOffset:1,

			ls:[],
			skuDetails:[],
			skuDetailsColumn:[
				{
					title:'货号',
					key:'sku',
					align:'center'
				},

				{
					title:'价格',
					key:'price',
					align:'center',
				},

				{
					title:'名称',
					key:'title',
					align:'center',
				},

				{
					title:'销量',
					key:'sold_num',
					align:'center',	
				},

				{
					title:'操作',
					align:'center',
					render:(h,params)=>{
						let showSizeListButtonOptions = {
							props: {
                                type: 'primary',
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('showSizeListDetail',params)
                                }
                            }
						}

						let showSizeListButton = h('Button',showSizeListButtonOptions,'查看尺码详情')

						return h('div',[showSizeListButton])
					}
				}

			],
		},

		events:['showSizeListDetail'],

		async mounted() {
			await this.getSkuDetails();
		},

		methods:{
			async getSkuDetails() {
				this.loading = true
				let res = await Http.requestAsync({
					url:'/duApp/getAllDetails',
				}) 

				this.ls = res['data']['datas'].map((data,idx)=>{
					data['size_list'] = JSON.parse(data['size_list'])
					return data;
				})
				this.filterSearchDatas();
				this.loading = false
			},


			filterSearchDatas(){
				let res = []
				this.ls.forEach((data,idx)=>{
					if ( data['sku'].indexOf(this.search) !== -1 ) {
						res.push(data)
					}
				})
				this.skuDetails = res;
			},

			showSizeListDetail(params) {
				this.showSizeListModal = true
				this.selectSku = params['row']['sku']
				this.selectIdx = params['index']
				this.selectSizeList = this.skuDetails[this.selectIdx]['size_list'];
			},

			async exportDetails() {
				this.loading = true
				let targetServer = `${Http.getBaseURL()}/duApp/exportDetails`;
				window.location.href = targetServer
				this.loading = false
			}

		},

		watch:{
			'search':function() {
				this.filterSearchDatas()
			}
		}

	})

	
</script>







