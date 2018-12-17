<template>
	<div id="DuAppSkuSave">
		<div class="admin-component-inner-box">
			<Card class="admin-iview-core-card">
				<div slot="title">
					<Icon type="ios-circle-filled"></Icon>
					货号存储
				</div>

				<div class="admin-component-margin-bottom">输入货号:</div>
				<Input 
					placeholder="请输入货号..."
					class="admin-component-margin-bottom"
					type="textarea"
					:rows="20"
					v-model="skus"
				></Input>

				<div style="display: flex;justify-content: flex-end;">
					<Button 
						type="primary" 
						size="large" 
						icon="checkmark-circled" 
						@click="saveSku"
					>保存</Button>
				</div>

			</Card>
		</div>

		<div style="height:150px;"></div>

	</div>
</template>

<script type="text/javascript">
	import {vuec} from "vuec"
	import Http from "@/utils/Http"
	export default vuec({
		name:'DuAppSkuSave',
		data:{
			skus:'',
		},
		mounted(){

		},

		methods:{
			async saveSku() {
				let person = [
					{'name':'cyf'},
					{'name':'lh'},
					{'name':'aa'}
				]

				let ages = [1,2,3]

				if ( this.skus === '' ) {
					this.$Notice.error({title:'请粘贴货号'});
					return 
				}


				let skuArr = this.skus.split('\n')
				let filterSkuArr = skuArr.filter((sku,idx)=>{
					return sku !== ""
				})

				if ( skuArr.length > 1 ) {
					if ( filterSkuArr[0].indexOf('货号') !== -1 ) {
						filterSkuArr.splice(0,1)
					}	
				}

				let form = new FormData()
				form.append("skus", JSON.stringify(filterSkuArr));

				let res = await Http.requestAsync({
					method:'post',
					url:'/duApp/saveSkus',
					data:form				
				})

				if (res.code == 400) {
					this.$Notice.error({title:'保存失败'});
				}

				if (res.code === 200) {
					this.$Notice.success({
						title:'保存了'+res['data']['new']+'条记录,其中'+res['data']['exists']+'已经存在'
					})
				}

				this.skus = '';
			}	
		},

	})
</script>

<style scoped>

	@custom-media --large (min-width: 1500px);
	@custom-media --notebook (min-width: 1025px) and (max-width: 1280px);
	@custom-media --ipad (min-width: 769px) and (max-width: 1024px);
	@custom-media --phone (max-width: 768px);
	@custom-media --small (max-width: 580px);


	.title-table-style {
		width: 20%;height: 35px;
		display:flex;align-items:center;
		justify-content:center;background: #e9eaec;
		color:#414A52
	}

	.title-table-border {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}	

	.title-table-border-end {
		border-left:1px solid #dddee1;
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.content-table-style {
		width: 20%;height: 35px;
		display:flex;align-items:center;
		justify-content:center;color:#414A52
	}

	.content-table-border {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.content-table-border-end {
		border-left:1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.echarts-image-container {
		width: 50%;
		width:100% ?if media (--phone);
	}


	.total-table-ver-box{
		width: 100%;
		display: none ?if media (--small);

	}

	.total-table-hor-box {
		display: none;
		width: 100%;
		display: block ?if media (--small);
	}

	.total-table-hor-table-title-border {
		border-top: 1px solid #dddee1;
		border-left: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.total-table-hor-table-title-border-end {
		border-top: 1px solid #dddee1;
		border-left: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

	.total-table-hor-table-content-border {
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
	}

	.total-table-hor-table-content-border-end {
		border-top: 1px solid #dddee1;
		border-right: 1px solid #dddee1;
		border-bottom: 1px solid #dddee1;
	}

</style>