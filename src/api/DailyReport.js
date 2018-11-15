import NP from 'number-precision'


// 日报现货表数据组装计算
const dailyReportCurrentStockComputed = (datas)=>{
	var res = {}
	var titles = [] 
	var amountTitles = ['库存量','周销量','平均售价','周成本']
	var amountDatas ={
		'库存量':[],
		'周销量':[],
		'平均售价':[],
		'周成本':[],
	}
	var rateTitles = ['周毛利率','库销比','效率值','折扣']
	var rateDatas = {
		'周毛利率':[],
		'库销比':[],
		'效率值':[],
		'折扣':[],
	}

	var totalAmountDatas = {
		'库存量':[],
		'周销量':[],
		'平均售价':[],
		'周成本':[],
	}
	var totalRateDatas = {
		'周毛利率':[],
		'库销比':[],
		'效率值':[],
		'折扣':[],
	}

	// console.log('原始数据',datas)
	for (let weekIdx in datas) {
		let data = datas[weekIdx]
		let count = data.length
		let buildIdx = `近${weekIdx[0]}周`;
		res[buildIdx] = {}
		if(count === 0) {
			res[buildIdx]['库存量'] = NaN
			res[buildIdx]['周销量'] = NaN
			res[buildIdx]['周毛利率'] = NaN
			res[buildIdx]['平均售价'] = NaN
			res[buildIdx]['库销比'] = NaN
			res[buildIdx]['效率值'] = NaN
			res[buildIdx]['折扣'] = NaN
			res[buildIdx]['周成本'] = NaN
			continue
		}
		// 牌价
		let brandPrice = 0
		// 库存总合
		let stockSum = 0
		// 毛利总计
		let maoriSum = 0
		// 零售总量
		let retailSum = 0
		// 周零售单价总计
		let retailPriceSingleSum = 0
		// 周零售销售额总计
		let retailPriceAmount = 0
		// 加权成本总额
		let costJiaquanSum = 0

		data.forEach((v,dataIdx)=>{
			// 解析成本信息
			v['cost_info'] = JSON.parse(v['cost_info']);
			// 计算库存总计
			stockSum+=v['total'];
			// 计算周总毛利
			maoriSum = NP.plus(
				NP.strip(maoriSum),
				NP.strip(parseFloat(v['maori']))
			)
			// 得到牌价
			brandPrice = v['brand_price']
			// 计算零售总量
			retailSum+=v['retail']

			// 计算周零售单价总计
			if (parseFloat(v['retail_price']) === 0 && v['retail'] == 0) {
				retailPriceSingleSum = 0
			} else {
				retailPriceSingleSum = NP.plus( 
					NP.divide(NP.strip(parseFloat(v['retail_price'])),v['retail']),
					NP.strip(retailPriceSingleSum)
				)
			}
			// 计算周零售销售额总计
			retailPriceAmount = NP.plus(
				NP.strip(parseFloat(v['retail_price'])),
				NP.strip(retailPriceAmount)
			)
			// 计算加权成本周总计
			costJiaquanSum = NP.plus(
				NP.strip(parseFloat(v['cost_info']['cost_jiaquan'])),
				NP.strip(costJiaquanSum)
			)
		})


		// 库存周平均值
		let stockAve = parseInt(stockSum/count)
		// 周毛利率
		let maoriRate
		if ( maoriSum === 0 && retailPriceAmount === 0 ) {
			maoriRate = 0	
		} else {
			maoriRate = NP.divide(maoriSum,retailPriceAmount)
		}
		// 周零售销售价平均值
		let retailPriceAve = NP.divide(retailPriceSingleSum,count)
		// 周加权成本平均值
		let costJiaquanAve = NP.divide(costJiaquanSum,count)
		console.log('costJiaquanAve',costJiaquanAve)


		res[buildIdx]['库存量'] = stockAve
		res[buildIdx]['周销量'] = retailSum
		res[buildIdx]['周毛利率'] = NP.times(maoriRate,100).toFixed(2)
		res[buildIdx]['平均售价'] = retailPriceAve.toFixed(2)
		if( retailSum === 0 ) {
			res[buildIdx]['库销比'] = NaN
		} else {
			res[buildIdx]['库销比'] = NP.strip((stockAve/(retailSum*4))).toFixed(2)
		}
		res[buildIdx]['效率值'] = (
			NP.divide(
				NP.times(NP.strip(retailSum/stockAve),maoriRate),
				0.0125
			)*100
		).toFixed(2)


		res[buildIdx]['折扣'] = (
			NP.divide(retailPriceAve,brandPrice)*10
		).toFixed(2)


		res[buildIdx]['周成本'] = costJiaquanAve.toFixed(2)
		console.log(buildIdx)

	}
	// console.log('组装后数据',res)
	titles = Object.keys(res).reverse()
	
	for(let i in res) {
		let data = res[i]
		Object.keys(data).forEach((k,i)=>{
			if(amountDatas.hasOwnProperty(k)) {
				amountDatas[k].unshift(data[k])
			}
			if(rateDatas.hasOwnProperty(k)) {
				rateDatas[k].unshift(data[k])
			}

			if(totalAmountDatas.hasOwnProperty(k) && !isNaN(data[k])) {
				totalAmountDatas[k].unshift(data[k])
			}
			if(totalRateDatas.hasOwnProperty(k) && !isNaN(data[k])) {
				totalRateDatas[k].unshift(data[k])
			}
		})
	}

	var resourceDatas = res
	var buildedDatas = {...totalAmountDatas,...totalRateDatas}
	var totalDatas = {} 
	for(let i in buildedDatas) {
		var datas = buildedDatas[i]
		var sum = 0
		if( datas.length > 0 ) {
			sum = datas.reduce((prev,curr)=>{
				return NP.plus(parseFloat(prev),parseFloat(curr))
			})
		}
		
		switch(i) {
			case '周销量':
				totalDatas[i] = sum
				break;
			case '库销比':
				totalDatas[i] = sum
				break;
			case '库存量':
				if( sum === 0 ) {
					totalDatas[i] = 0
				} else {
					totalDatas[i] = parseInt(sum/datas.length)
				}
				break;
			default :
				if( sum === 0 ) {
					totalDatas[i] = 0
				} else {
					totalDatas[i] = NP.divide(sum,datas.length).toFixed(2)
				}
				break;
		}
	}
	if( totalDatas['周销量'] == 0 ) {
		totalDatas['库销比'] = 'Infinity'
	} else {
		totalDatas['库销比'] = NP.divide(totalDatas['库存量'],totalDatas['周销量']).toFixed(2)
	}

	return {
		resourceDatas,
		buildedDatas,
		titles,
		amountTitles,
		amountDatas,
		rateTitles,
		rateDatas,
		totalDatas
	}
}

export {
	dailyReportCurrentStockComputed,
}