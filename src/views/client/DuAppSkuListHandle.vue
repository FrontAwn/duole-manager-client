<template>
	<div id="DuAppSkuListHandle">

		<div class="admin-component-inner-box">
	 		<Input 
	 			v-model="search"
	 			icon="search"
	 			placeholder="请输入要搜索的货号..."
	 			class="admin-iview-core-card"
	 		></Input>
	 	</div>

	 	<div class="admin-component-inner-box">

	 		<Tabs 
	 			type="card" 
	 			class="admin-iview-core-card"
	 			@on-click="tabSwitch"
	 		>
		        <TabPane label="需要处理的货号" name="needHandleLs" style="padding-left: 5px;padding-right: 5px">
		        	<Table 
		        		border 
		        		:columns="needHandleColumns" 
		        		:data="needHandleLs"
		        		:loading="loading"
		        	></Table>

		        </TabPane>
		        <TabPane label="已经处理的货号(需审核)" name="alreadyHandleLs" style="padding-left: 5px;padding-right: 5px">
		        	<Table 
		        		border 
		        		:columns="alreadyHandleColumns" 
		        		:data="alreadyHandleLs"
		        		:loading="loading"
		        	></Table>
		        </TabPane>
		        
		        <TabPane label="异常货号" name="exceptionSkuLs" style="padding-left: 5px;padding-right: 5px">
		        	<Table 
		        		border 
		        		:columns="exceptionSkuColumns" 
		        		:data="exceptionSkuLs"
		        		:loading="loading"
		        	></Table>
		        </TabPane>

		        <TabPane label="新添货号" name="newSkuLs" style="padding-left: 5px;padding-right: 5px">
		        	<Table 
		        		border 
		        		:columns="newSkuColumns" 
		        		:data="newSkuLs"
		        		:loading="loading"
		        	></Table>
		        </TabPane>
 			</Tabs>
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

		<Modal
		    v-model="throwExceptionModal"
		    :title="selectSku"
			@on-ok="saveException"
		>
		    
			<div style="margin-bottom: 10px">请输入异常原因:</div>
			<Input 
				v-model="inputExceptContent" 
				placeholder="请输入异常原因..."
				style="margin-bottom: 10px"
			></Input>

		</Modal>


		<div style="height:150px;"></div>
	</div>
</template>

<script type="text/javascript">
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	import Event from "@/utils/Emitter"

	const TYPE_SINGLE = 0
	const TYPE_MULTIPLE = 1
	const TYPE_NOTRESULT = 2
	const NOT_ANALYSIS_STATE = 0
	const ALREADY_ANALYSIS_STATE = 1
	const ALREADY_CONFIM_STATE = 2
	const EXCEPTION_STATE = 3
	const DEFAULT_OFFSET = 1

	export default vuec({
		name:'DuAppSkuListHandle',
		events:['showSkuTotalNames','inputSkuTargetName','saveInputSkuTargetName','returnAgainHandle','confimSkuState','throwException'],
		data:{
			throwExceptionModal:false,
			inputSkuTargetNameModal:false,

			loading:false,
			search:'',
			searchLs:{
				'needHandleLs':'',
				'alreadyHandleLs':'',
				'exceptionSkuLs':'',
				'newSkuLs':''
			},
			tabName:'needHandleLs',
					

			ls:{},
			needHandleLs:[],
			alreadyHandleLs:[],
			exceptionSkuLs:[],
			newSkuLs:[],
			alreadyConfimLs:[],

			selectIndex:'',
			selectSku:'',

			inputTargetName:'',
			inputOffset:1,
			inputExceptContent:'',

			// 需要处理的货号
			needHandleColumns:[
				{
					title: '货号',
                    key: 'sku',
                    align: 'center',
				},

				{
					title: '结果数量',
					key:'total',
                    align: 'center',
				},

				{
					title: '操作',
                    align: 'center',
					minWidth:70,                    
					render: (h, params) => {
						let el = 'div';
						let opEl = 'Button'

						// 输入名称
						let inputTargetNameButtonOptions = {
							props: {
                                type: 'warning',
                                shape:"circle",
                                icon:'compose'
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

						// 参考名称
						let relationNamesButtonOptions = {
							props: {
                                    type: 'ghost',
                                    shape:"circle",
                                    icon:'search'
                                },
                                style: {
                                    marginTop: '5px',
                                    marginRight: '10px',
                                    marginBottom: '5px',
                                },
                                on: {
                                    click: () => {
                                        Event.emit('showSkuTotalNames',params)
                                    }
                                }
						}

						// 修改名称
						let updateTargetNameButtonOptions = {
							props: {
                                    type: 'ghost',
                                    shape:"circle",
                                    icon:'search'
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

						// 确认名称

						let confimTargetNameButtonOptions = {
							props: {
                                type: 'primary',
                                shape:"circle",
                                icon:'checkmark',
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('saveInputSkuTargetName',params)
                                }
                            }
						}

						let exceptionButtonOptions = {
							props: {
                                type: 'error',
                                shape:"circle",
                                icon:'bug'
                            },
                            style: {
                                marginTop: '5px',
                                marginRight: '10px',
                                marginBottom: '5px'
                            },
                            on: {
                                click: () => {
                                    Event.emit('throwException',params)
                                }
                            }
						}

						let inputTargetNameButton = h(opEl,inputTargetNameButtonOptions);

						let relationNamesButton = h(opEl,relationNamesButtonOptions)

						let updateTargetNameButton = h(opEl,updateTargetNameButtonOptions)

						let confimTargetNameButton = h(opEl,confimTargetNameButtonOptions)

						let exceptionButton = h(opEl,exceptionButtonOptions)


						let typeMultipleButtonGroup = h(el,[
							relationNamesButton,
							exceptionButton,
							inputTargetNameButton,
						])

						let typeSingleButtonGroup = h(el,[
							updateTargetNameButton,
							exceptionButton,
							confimTargetNameButton,
						])

						if (params['row']['type'] === TYPE_SINGLE) {
							return typeSingleButtonGroup
						} else {
							return typeMultipleButtonGroup
						}

					}
				}
			],

			// 已经处理的货号
			alreadyHandleColumns:[
				{
					title: '货号',
                    key: 'sku',
                    align: 'center',
				},

				{
					title: '精确名称',
                    key: 'target_name',
                    align: 'center',
				},

				{
					title: '操作',
                    align: 'center',
					render: (h, params) => {
						let el = 'div';
						let opEl = 'Button'

						let resetHandleButtonOptions = {
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
                                    Event.emit('returnAgainHandle',params)
                                }
                            }
						}

						let confimButtonOptions = {
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
                                    Event.emit('confimSkuState',params)
                                }
                            }

						}

						let resetHandleButton = h(opEl,resetHandleButtonOptions,'重新处理')

						let confimButton = h(opEl,confimButtonOptions,'审核通过')

						let buttonGroup = h(el,[resetHandleButton,confimButton])

						return buttonGroup
					}
				}
			],

			exceptionSkuColumns:[
				{
					title:'货号',
					key:'sku',
					align:'center'
				},

				{
					title:'异常原因',
					key:'except_content',
					align:'center'
				}
			],

			newSkuColumns:[
				{
					title:'货号',
					key:'sku',
					align:'center'
				}
			],

		},
		async mounted(){
			this.ls['needHandleLs'] = []
			this.ls['alreadyHandleLs'] = []
			this.ls['exceptionSkuLs'] = []
			this.ls['newSkuLs'] = []
			await this.getDatas()
		},

		methods:{
			// 切换tab
			tabSwitch(tabName) {
				this.tabName = tabName
				this.search = this.searchLs[this.tabName];
			},

			async getDatas() {
				this.loading = true
				let res = await Http.requestAsync({
					url:'/duApp/getAllSkus'
				})

				res['data']['datas'].forEach((data,idx)=>{
					if ( data['target_name'] === '' && data['state'] === ALREADY_ANALYSIS_STATE ) {
						data['total_name'] = JSON.parse(data['total_name']);
						this.needHandleLs.push(data);
						this.ls['needHandleLs'].push(data)
					}

					if ( data['target_name'] !== '' && data['state'] === ALREADY_ANALYSIS_STATE ) {
						this.alreadyHandleLs.push(data);
						this.ls['alreadyHandleLs'].push(data)
					}

					if ( data['state'] === NOT_ANALYSIS_STATE ) {
						this.newSkuLs.push(data);
						this.ls['newSkuLs'].push(data)
					}

					if ( data['state'] === EXCEPTION_STATE ) {
						this.exceptionSkuLs.push(data)
						this.ls['exceptionSkuLs'].push(data)
					}

				})	

				this.loading = false
			},

			transferDatas (from,fromIndex,to) {
				let data = from[fromIndex]
				from.splice(fromIndex,1);
				to.unshift(data)
			},

			showSkuTotalNames (params) {
				let content = ""
				let totalNames = params['row']['total_name']
				totalNames.forEach((name,idx)=>{
					content += `<p><h4>${name}</h4></p><br>`
				})
				
    			this.$Modal.info({
    				title: '参考名称',
    				content,
    			})
			},

			inputSkuTargetName (params) {
				this.selectSku = params['row']['sku']
				this.selectIndex = params['index']
				if ( params['row']['type'] == TYPE_SINGLE ) {
					this.inputOffset = params['row']['offset']
					this.inputTargetName = params['row']['total_name'][0]
				} else {
					this.inputOffset = this.needHandleLs[this.selectIndex]['offset'];	
					this.inputTargetName = this.needHandleLs[this.selectIndex]['target_name'];	
				}
				this.inputSkuTargetNameModal = true;
			},

			async saveInputSkuTargetName (params=null) {
				let sku,targetName,index,offset;
				if ( params === null ) {
					sku = this.selectSku
					index = this.selectIndex					
					targetName = this.inputTargetName
					offset = this.inputOffset
				} else {
					sku = params['row']['sku']
					index = params['index']
					targetName = params['row']['total_name'][0]
					offset = params['row']['offset']
				}
				this.needHandleLs[index]['target_name'] = targetName;
				this.needHandleLs[index]['offset'] = offset;
				this.transferDatas(this.needHandleLs,index,this.alreadyHandleLs);
				this.$Notice.success({title:'操作成功'})
				
				Http.requestAsync({
					url:'/duApp/saveSkuTargetName',
					data:{
						sku,
						targetName,
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

			},

			async returnAgainHandle(params) {
				let index = params['index']
				let sku = params['row']['sku']
				this.alreadyHandleLs[index]['target_name'] = ""
				this.transferDatas(this.alreadyHandleLs,index,this.needHandleLs);
				this.$Notice.success({title:'操作成功'})
				await Http.requestAsync({
					url:'/duApp/saveSkuTargetName',
					data:{
						sku,
						targetName:'',
					},
				})
			},

			async confimSkuState(params) {
				let index = params['index']
				let sku = params['row']['sku']
				this.alreadyHandleLs[index]['state'] = ALREADY_CONFIM_STATE
				this.transferDatas(this.alreadyHandleLs,index,this.alreadyConfimLs)
				this.$Notice.success({title:'操作成功'})

				await Http.requestAsync({
					url:'/duApp/saveSkuState',
					data:{
						sku,
						state:ALREADY_CONFIM_STATE
					},
				})
			},

			getSearchResultSkuLs() {
				let res
				if ( this.search === '' ) {
					res = JSON.parse(JSON.stringify(this.ls[this.tabName]))
				} else {
					res = []
					this.ls[this.tabName].forEach((data,idx)=>{
						if ( data['sku'].indexOf(this.search) >= 0 ) {
							res.push(data)
						}
					})
				}
				this[this.tabName] = res
			},

			throwException(params) {
				this.selectIndex = params['index']
				this.selectSku = params['row']['sku']
				this.inputExceptContent = params['row']['except_content']
				this.throwExceptionModal = true
			},

			saveException() {
				let sku,index,exceptContent
				sku = this.selectSku
				index = this.selectIndex
				exceptContent = this.inputExceptContent
				this.needHandleLs[index]['except_content'] = exceptContent
				this.needHandleLs[index]['state'] = EXCEPTION_STATE
				this.transferDatas(this.needHandleLs,index,this.exceptionSkuLs)
				this.$Notice.success({title:'已抛出异常'})
				Http.requestAsync({
					url:'/duApp/saveExceptContent',
					data:{
						sku,
						exceptContent,
					}
				})

				Http.requestAsync({
					url:'/duApp/saveSkuState',
					data:{
						sku,
						state:EXCEPTION_STATE,
					}
				})
			}

		},

		watch:{

			'search':function(){
				if ( this.searchLs[this.tabName] === '' && this.search === '' ) {
					return;
				}
				this.searchLs[this.tabName] = this.search
				this.getSearchResultSkuLs()
			}

		}

	})

</script>

<style scoped>

	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);
	@custom-media --small (max-width: 580px);

</style>