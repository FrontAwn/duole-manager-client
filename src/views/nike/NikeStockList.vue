<template>
	<div id="NikeStockList">
		<div id="header" class="flex-container-justify-center">
			<div style="width: 93%;height: 100%;display: flex;justify-content: space-between;">
				<div style="width: 60%;height: 100%;display: flex;align-items: center;">
					<Input icon="search" v-model="searchSku" placeholder="请输入要搜索的货号..."></Input>
				</div>
				<div id="header-right">
					<Button type="primary" icon="archive" :loading="downloadStockLoading" @click="exportStock">
				        <span v-if="!downloadStockLoading">下载库存</span>
				        <span v-else>正在下载</span>
				    </Button>
				</div>
			</div>
		</div>


		<div class="flex-container-justify-center">
			<div id="content">
				<div style="margin-top: 90px;width: 100%;display: flex;justify-content: space-between;flex-wrap: wrap;">
					<Card class="card-content" :key="idx" v-for="(data,idx) in ls">
						<Spin fix v-show="!data['loadInfoState']"></Spin>
						<div slot="title">{{data.sku}}</div>
						<div slot="extra" style="position: relative;">
							 <Tag 
							 	v-if="data['loadInfoState'] && data['info']['closeout']"
							 	color="red" 
							 	style="position: absolute;top: -5px;left: -47px;"
							 >过季</Tag>
						</div>

						<div style="width: 100%;display: flex;">
							<!-- left -->
							<div class="card-left-box">
								<img 
									:src="'http://192.168.1.121:3000/?sku='+data.sku+''" 
									class="sku-image"
								/>
								<Button 
									style="width: 100%;" 
									type="warning"
									@click="openTaobaoLink(data.sku)"
								>淘宝链接</Button>

								<Button 
									style="width: 100%;margin-top: 5px;" 
									type="primary"
									@click="openNikeLink(data.sku)"
								>Nike连接</Button>
							</div>

							<!-- right -->
							<div 
								style="width: 100%;display: flex;justify-content: flex-end;"
								v-if="data['loadInfoState']"
							>
								<div style="width: 97%;height: 100px;">
									<div class="content-sku-name">
										<span style="font-weight: bold;">{{data.info.name}}</span>
										<span style="color:#E9935F;margin-left: 10px;font-weight: bold;">¥{{data.info.retailPrice/100}}</span>
									</div>

									<div style="margin-top: 10px;width: 100%;display: flex;justify-content: center;flex-wrap: wrap;">
										<Tag  color="#22A1C4">{{data.info.season}}</Tag>
										<Tag  color="#22A1C4">{{data.info.category}}</Tag>
										<Tag  color="#22A1C4">{{data.info.type}}</Tag>
										<Tag  color="#22A1C4">{{data.info.gender}}</Tag>
									</div>

									<div style="margin-top: 10px;width: 100%;display: flex;flex-wrap: wrap;justify-content: center;">
										<div 
											v-for="size in sizesOrdered"
											v-if="data.stockCurrent[size] || data.stockChange[size]"
											style="width: 95px;height:30px;margin-right: 5px;margin-left:5px;margin-bottom: 10px;display: flex;" 
										>
											<div style="width: 30px;height:30px;background: #20282B;border-top-left-radius: 5px;border-bottom-left-radius: 5px;display: flex;justify-content: center;align-items: center;color:#FFFFFF">{{size}}</div>
											<div style="width: 55px;height:30px;border:1px solid #20282B;border-top-right-radius: 5px;border-bottom-right-radius: 5px;display: flex;justify-content: center;align-items: center;">
												<span>{{data.stockCurrent[size]}}</span>
												<span v-if="data.stockChange[size]" style="margin-left: 5px;color:#F46565">{{data.stockChange[size]}}</span>
											</div>
										</div>
									</div>

								</div>
							</div>


						</div>
						<div style="width: 100%;height: 200px;"></div>


					</Card>
				</div>
			</div>
		</div>
		<!-- <div style="width: 50%;">{{sizesOrdered.join(",")}}</div> -->
	</div>
</template>

<script>
	import 'iview/dist/styles/iview.css';
	import '@/assets/less/theme.less';
	import "@/assets/css/admin.css";
	import {vuec} from "vuec";
	import Vue from "vue";
	import iView from "iview";
	import Http from "@/utils/Http.js"
	const moment = require("moment")
	Vue.use(iView);

	export default vuec({
		name:"NikeStockList",
		data:{
			moment,
			loading:false,
			searchSku:"",
			ls:{},
			skus:{},
			nikeStockChangeConditions:{
				db:"SjNikeStock",
				table:"NikeStockChange",
				attrs:['*'],
				where:{
					'orderScore':{
						"$gte":2
					}
				},
				page:14,
				length:20,
				order:[['orderScore','DESC'],['id','DESC']],
			},


			sizesOrdered: 'MISC 2C 3C  4C  5C  6C  7C  8C  9C  10C 10.5C 11C 11.5C 12C 12.5C 13.5C 13C 1Y 1.5Y 2Y 2.5Y 3Y 3.5Y 4Y  4.5Y  5Y  5.5Y  6Y  6.5Y  7Y 5  5.5 6 6.5 7 7.5 8 8.5 9 9.5 10  10.5  11  11.5  12 12.5 13 XS  S M L XL XXL XXXL 2XL 3XL 4-5.5 6-7.5 8-9.5 10- 12- 14-16'.replace(/  /img, ' ').split(' '),

			downloadStockLoading:false,
		},
		async mounted(){
			this.getList()
		},

		methods:{
			async getList() {
				let self = this
				let res = await Http.requestAsync({
					url:"/api/finds",
					data:self.nikeStockChangeConditions
				})
				let datas = res['data']
				for (let [idx,data] of datas.entries()) {
					let sku = data['sku']
					if(data.type==='newSku' || data.type==='newBatches') {
						data.stockChange = data.stock
					}
					data.stockCurrent = {}
					data.stockChange = JSON.parse(data.stockChange)
					data.stock = JSON.parse(data.stock)
					data.loadInfoState = false
					self.skus[idx] = sku
				}
				self.ls = JSON.parse(JSON.stringify(datas))
				self.getSkuDetail()
			},

			async getSkuDetail() {
				let self = this
				for (let [idx,sku] of Object.entries(self.skus)) {
					Http.requestAsync({
						url:"/nike/getSkuInfo",
						data:{
							sku,
						}
					}).then(info=>{
						if (info && info.sizes) {
							self.ls[idx]['stockCurrent'] = info.sizes
							self.ls[idx]['info'] = info.info
							self.ls[idx]['loadInfoState'] = true
						}
					})
				}
			},

			async exportStock() {
				this.downloadStockLoading = true
				let res = await Http.requestAsync({
					url:"/nike/execGenerateStockCommand"
				})
				this.downloadStockLoading = false
				let targetServer = `${Http.getBaseURL()}/nike/downloadStockExcelFile`;
				window.location.href = targetServer
			},

			async openTaobaoLink(sku) {
				let url = `https://s.taobao.com/search?q=${sku}&sort=sale-desc`
				window.open(url);
			},

			async openNikeLink(sku) {
				let url = `https://atonce.nike.net/#/detail/id/${sku}`
				window.open(url);
			},
		},

		watch:{

		},
	})

</script>

<style scoped>
	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);

	#header {
		position:fixed;
		top:0;
		left:0;
		height:60px;
		background: #20282B;
		box-shadow: 0 1px 20px #20282B;
		z-index: 1000;
	}

	#header-right {
		width: 30%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		justify-content: center ?if media (--phone);
	}

	#content {
		width: 93%;
	}

	.card-content {
		width: 49%;
		width: 100% ?if media (--phone);
		height: 300px;
		margin-bottom: 20px;
		position: relative;
	}

	.card-left-box {
		width: 120px;
		width: 2.3rem ?if media (--phone);
	}

	.sku-image {
		width: 120px;
		width: 2.3rem ?if media (--phone);

		height: 120px;
		height: 2.3rem ?if media (--phone);
		border-radius: 5px;
	}

	.content-sku-name {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>









