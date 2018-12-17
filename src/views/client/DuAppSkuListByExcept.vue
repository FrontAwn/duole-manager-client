<template>
	
	<div id="DuAppSkuListByExcept">

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
        		:columns="exceptSkuColumn" 
        		:data="exceptSku"
        		:loading="loading"
        	></Table>
        </div>


        <Modal
		    v-model="editOptionsModal"
		    :title="selectSku"
			@on-ok="saveEditOptions"
		>
		    
			<div style="margin-bottom: 10px">选择搜索方式:</div>
			<Select v-model="selectType" style="width:250px;margin-bottom: 10px">
		        <Option v-for="(option,idx) in searchTypes" :value="option.type" :key="idx">{{ option.label }}</Option>
		    </Select>
			<div style="margin-bottom: 10px">调整对应位置:</div>
			<InputNumber v-model="inputOffset" :editable="false"></InputNumber>

		</Modal>

		<Modal
		    v-model="showSkipSkuModal"
		>	
			<p slot="header" style="color:#EA3517;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>忽略抓取</span>
	        </p>

			<div style="height: 50px;display: flex;justify-content: center;align-items: center;">
				<span style="font-size: 14px;margin-left: 20px;margin-top: 5px;">确定要忽略: {{selectSku}}?</span>
			</div>
			<div slot="footer">
	            <Button type="error" size="large" long  @click="saveSkipSku">确定</Button>
	        </div>
		</Modal>



		<Modal
		    v-model="showResetConfimModal"
		>	
			<p slot="header" style="color:#00C3B6;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>恢复货号重新抓取</span>
	        </p>

			<div style="height: 50px;display: flex;justify-content: center;align-items: center;">
				<span style="font-size: 14px;margin-left: 20px;margin-top: 5px;">确定要恢复: {{selectSku}}?</span>
			</div>
			<div slot="footer">
	            <Button type="primary" size="large" long  @click="saveResetConfimSku">确定</Button>
	        </div>
		</Modal>


        <div style="height:150px;"></div>

	 </div>

</template>

<script>
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	import Event from "@/utils/Emitter"

	const CONFIM_SKU = 2
	const EXCEPT_SKU = 3
	const SKIP_SKU = 4

	export default vuec({
		name:'DuAppSkuListByExcept',
		data:{
			editOptionsModal:false,
			showSkipSkuModal:false,
			showResetConfimModal:false,
			loading:false,

			search:'',
			page:1,
			length:50,

			selectSku:'',
			selectIdx:'',
			
			inputOffset:1,
			searchTypes:[
				{
					label:'前后单空格过滤',
					type:1,
				},

				{
					label:'确切货号过滤',
					type:2,
				},

				{
					label:'异常货号',
					type:3,
				},

				{
					label:'后单空格过滤',
					type:5,
				},

				{
					label:'后双空格过滤',
					type:6,
				},

				{
					label:'前单空格过滤',
					type:7,
				},

				{
					label:'前双空格过滤',
					type:8,
				}
			],
			selectType:1,


			ls:[],
			exceptSku:[],
			exceptSkuColumn:[
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
					title:'结果数量',
					key:'total',
					align:'center'
				},

				{
					title:'操作',
					align:'center',
					render:(h,params)=>{
						let editButtonOptions = {
							props: {
                                type: 'warning',
                                shape:"circle",
                                icon:'edit'
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('editOptions',params)
                                }
                            }
						}
						
						let passSkuButtonOptions = {
							props: {
                                type: 'error',
                                shape:"circle",
                                icon:'log-out'
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('switchSkipSkuModal',params)
                                    
                                }
                            }
						}

						let confimSkuButtonOptions = {
							props: {
                                type: 'primary',
                                shape:"circle",
                                icon:'checkmark'
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('switchResetConfimSkuModal',params)
                                    
                                }
                            }
						}

				
						let editButton = h('Button',editButtonOptions)

						let passSkuButton = h('Button',passSkuButtonOptions)

						let confimSkuButton = h('Button',confimSkuButtonOptions)

						return h('div',[passSkuButton,editButton,confimSkuButton])					

					}
				}

			],
		},

		events:['editOptions','switchSkipSkuModal','switchResetConfimSkuModal'],

		async mounted() {
			await this.getExceptSkus();
		},

		methods:{
			async getExceptSkus() {
				this.loading = true
				let res = await Http.requestAsync({
					url:'/api/finds',
					data:{
						table:'DuSkus',
						page:this.page,
						length:this.length,
						where:{
							'state':EXCEPT_SKU,
						}
					}
				})
				this.ls = res['data']
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
				this.exceptSku = res;
			},

			

			editOptions(params) {
				this.selectSku = params['row']['sku']
				this.selectIndex = params['index']
				this.selectType = params['row']['type']
				this.editOptionsModal = true;
			},

			switchSkipSkuModal(params) {
				this.selectSku = params['row']['sku']
				this.selectIndex = params['index']
				this.showSkipSkuModal = true
			},

			switchResetConfimSkuModal(params) {
				this.selectSku = params['row']['sku']
				this.selectIndex = params['index']
				this.showResetConfimModal = true
			},

			async saveSkipSku(params) {
				let index = this.selectIndex
				let sku = this.selectSku
				this.exceptSku.splice(index,1)
				this.$Notice.success({title:'操作成功'})
				this.showSkipSkuModal = false

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

			async saveEditOptions() {
				let sku,type,index,offset;
				sku = this.selectSku
				index = this.selectIndex					
				type = this.selectType
				offset = this.inputOffset
				this.exceptSku.splice(index,1)
				this.$Notice.success({title:'操作成功'})
				Http.requestAsync({
					url:'/api/update',
					data:{
						db:'SjResource',
						table:'DuSkus',
						content:{
							'type':type,
							'offset':offset,
							'state':2,
						},

						where:{
							sku,
						}
					},
				})
			},

			async saveResetConfimSku() {
				let sku,state,index;
				sku = this.selectSku
				index = this.selectIndex					
				state = CONFIM_SKU
				this.exceptSku.splice(index,1)
				this.$Notice.success({title:'操作成功'})
				this.showResetConfimModal = false
				Http.requestAsync({
					url:'/api/update',
					data:{
						db:'SjResource',
						table:'DuSkus',
						content:{
							state,
						},
						where:{
							sku,
						}
					},
				})
			},
			

		},

		watch:{
			'search':function() {
				this.filterSearchDatas()
			}
		}

	})

	
</script>







