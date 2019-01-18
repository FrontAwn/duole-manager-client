<template>
	<div id="NikeStockList">
		<div id="header" class="flex-container-justify-center">
			<div style="width: 93%;height: 100%;display: flex;justify-content: space-between;">
				<div style="width: 60%;height: 100%;display: flex;align-items: center;">
					<Input icon="search" v-model="searchSku" placeholder="请输入要搜索的货号..."></Input>
				</div>
				<div style="width: 30%;height: 100%;display: flex;align-items: center;">
					<Button type="primary" icon="archive" @click="exportStock">
						下载库存
				    </Button>
				</div>
			</div>
		</div>


		<div class="flex-container-justify-center">
			<div id="content">
				<div style="margin-top: 20px;width: 100%;display: flex;justify-content: space-between;flex-wrap: wrap;">
					<Card class="card-content" v-for="(data,idx) in ls">
						<div slot="title">{{data.sku}}</div>
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
	Vue.use(iView);

	export default vuec({
		name:"NikeStockList",
		data:{
			searchSku:"",
			ls:[],
			nikeStockChangeConditions:{
				db:"SjNikeStock",
				table:"NikeStockChange",
				attrs:['*'],
				where:{
					'orderScore':{
						"$gte":2
					}
				},
				page:1,
				length:20,
				order:[['orderScore','DESC'],['id','DESC']],
			},


			sizesOrdered: 'MISC 2C 3C  4C  5C  6C  7C  8C  9C  10C 10.5C 11C 11.5C 12C 12.5C 13.5C 13C 1Y 1.5Y 2Y 2.5Y 3Y 3.5Y 4Y  4.5Y  5Y  5.5Y  6Y  6.5Y  7Y 5  5.5 6 6.5 7 7.5 8 8.5 9 9.5 10  10.5  11  11.5  12 12.5 13 XS  S M L XL XXL XXXL 2XL 3XL 4-5.5 6-7.5 8-9.5 10- 12- 14-16'.replace(/  /img, ' ').split(' '),

		},
		async mounted(){
			this.getList()
		},

		methods:{
			async getList() {
				let self = this
				try {
					let res = await Http.requestAsync({
						url:"/api/finds",
						data:self.nikeStockChangeConditions
					})
					let datas = res['data']
					for (let [idx,data] of datas.entries()) {
						if(data.type==='newSku' || data.type==='newBatches') {
							data.stockChange = data.stock
						}
						try {
							data.stockChange = JSON.parse(data.stockChange)
						} catch (e) {}
						try {
							data.stock = JSON.parse(data.stock)
						} catch (e) {}
					}
					self.ls = datas					
					console.log(datas)
				} catch(e) {
					console.log(e)
				}
			},

			async exportStock() {
				let targetServer = `${Http.getBaseURL()}/nike/exportStock`;
				window.open(targetServer)
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
		height:60px;
		background: #20282B;
		box-shadow: 0 1px 20px #20282B;
	}

	#content {
		width: 93%;
	}

	.card-content {
		width: 48%;
		width: 100% ?if media (--ipad);
		width: 100% ?if media (--phone);
		margin-bottom: 20px;
	}
</style>









