<template>

	<div id="Carousel">
		
		<div id="carousel-left-button" @click="left"></div>

		<div id="carousel-right-button" @click="right"></div>

		<div 
			class="carousel-item-content-box" 
			:style="{
				width:itemsCount*100+'%',
				transform:'translate3d('+offsetX+'px,'+offsetY+'px,'+offsetZ+'px)',
				transition:'all '+transtionTime+'s',
			}">

			<div :style="{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}" v-for="(v,k) in items">{{v}}</div>

		</div>

	</div>

</template>

<script>

	import {vuec} from "vuec";

	export default vuec({
		name:'Carousel',

		data:{
			items:['php','js','english','mysql','redis'],
			offsetX:0,
			offsetY:0,
			offsetZ:0,
			transtionTime:0.5,
		},
		computed:{
			itemsCount() {
				return this.items.length;
			},
		},

		methods:{

			left() {
				var self = this
				self.offsetX -= 100
			},

			right() {
				var self = this
				self.offsetX += 100
			}	
				
		}
	})
	
</script>

<style>

	#Carousel {
		width: 100%;
		height: 100%;
		position: relative;
		top:0;
		left:0;
	}

	#carousel-left-button {
		position: absolute;
		top:50%;margin-top: -25px;
		left:5%;
		width: 50px;
		height: 50px;
		background: red;
		border-radius: 100%;
		z-index: 500
	}

	#carousel-right-button {
		position: absolute;
		top:50%;margin-top: -25px;
		right:5%;width: 50px;
		height: 50px;background: red;
		border-radius: 100%;
		z-index: 500;
	}


	.carousel-item-content-box {
		display: flex;
		height: 100%;
	}


</style>






