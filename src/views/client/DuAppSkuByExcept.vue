<template>
	
	<div id="DuAppSkuByExcept">

		<div class="admin-component-inner-box">
	 		<Input 
	 			v-model="search"
	 			icon="search"
	 			placeholder="请输入要搜索的货号..."
	 			class="admin-iview-core-card"
	 		></Input>


	 	</div>

		<div class="admin-component-inner-box">
	 		<Table 
	 			class="admin-iview-core-card"
        		border 
        		:columns="exceptSkusColumn" 
        		:data="exceptSkus"
        		:loading="loading"
        	></Table>
        </div>


        <Modal
		    v-model="inputSkuTargetNameModal"
		    :title="selectSku+':对应的准确名称(切记准确)!'"
			@on-ok="saveInputSkuTargetName"
		>
		    
			<div style="margin-bottom: 10px">请输入对应名称:</div>
			<Input 
				v-model="inputTargetName" 
				placeholder="请输入对应的准确名称..."
				style="margin-bottom: 10px"
			></Input>
			<div style="margin-bottom: 10px">调整对应位置:</div>
			<InputNumber v-model="inputOffset" :editable="false"></InputNumber>

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
		name:'DuAppSkuByExcept',
		data:{
			inputSkuTargetNameModal:false,
			loading:false,
			search:'',

			selectSku:'',
			selectIdx:'',

			inputTargetName:'',
			inputOffset:1,

			ls:[],
			exceptSkus:[],
			exceptSkusColumn:[
				{
					title:'货号',
					key:'sku',
					align:'center'
				},

				{
					title:'异常原因',
					key:'except_content',
					align:'center'
				},

				{
					title:'操作',
					align:'center',
					render:(h,params)=>{
						let inputTargetNameButtonOptions = {
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
                                    Event.emit('inputSkuTargetName',params)
                                }
                            }
						}

						let passSkuButtonOptions = {
							props: {
                                type: 'ghost',
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('skipSkuCheck',params)
                                }
                            }
						}

						let inputTargetNameButton = h('Button',inputTargetNameButtonOptions,'输入名称')

						let passSkuButton = h('Button',passSkuButtonOptions,'跳过审查')

						return h('div',[passSkuButton,inputTargetNameButton])					

					}
				}

			],
		},

		events:['inputSkuTargetName','skipSkuCheck'],

		async mounted() {
			await this.getExceptSkus();
		},

		methods:{
			async getExceptSkus() {
				this.loading = true
				let res = await Http.requestAsync({
					url:'/duApp/getExceptSkus',
					data:{
						state:EXCEPTION_STATE
					}
				}) 
				this.ls = res['data']['datas']
				this.filterSearchDatas();
				this.loading = false
			},

			transferDatas (from,fromIndex,to) {
				let data = from[fromIndex]
				from.splice(fromIndex,1);
				to.unshift(data)
			},


			filterSearchDatas(){
				let res = []
				this.ls.forEach((data,idx)=>{
					if ( data['sku'].indexOf(this.search) !== -1 ) {
						res.push(data)
					}
				})
				this.exceptSkus = res;
			},

			inputSkuTargetName(params) {
				this.selectSku = params['row']['sku']
				this.selectIndex = params['index']
				this.inputSkuTargetNameModal = true;
			},

			async skipSkuCheck(params) {
				let index = params['index']
				let sku = params['row']['sku']
				this.exceptSkus.splice(index,1)
				this.$Notice.success({title:'操作成功'})
				Http.requestAsync({
					url:'/api/update',
					data:{
						db:'SjResource',
						table:'DuSkus',
						content:{
							state:SKIP_SKU
						},

						where:{
							sku,
						}
					},
				})
			},

			async saveInputSkuTargetName() {
				let sku,targetName,index,offset;
				sku = this.selectSku
				index = this.selectIndex					
				targetName = this.inputTargetName
				offset = this.inputOffset
				this.exceptSkus.splice(index,1)
				this.$Notice.success({title:'操作成功'})

				Http.requestAsync({
					url:'/api/update',
					data:{
						db:'SjResource',
						table:'DuSkus',
						content:{
							'target_name':targetName,
							'type':2,
						},

						where:{
							sku,
						}
					},
				})

				if ( offset != DEFAULT_OFFSET ) {
					Http.requestAsync({
						url:'/duApp/saveSkuOffset',
						data:{
							sku,
							offset,
						},
					})	
				}
			}

		},

		watch:{
			'search':function() {
				this.filterSearchDatas()
			}
		}

	})

	
</script>







