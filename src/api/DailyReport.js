
const dailyReportCurrentStockComputed = (datas)=>{
	var res = {}
	var titles = [] 
	var amountTitles = ['库存量','周销量','平均售价','周成本']
	var amountDatas =[]
	var rateTitles = ['周毛利率','库销比','效率值','折扣']
	var rateDatas = []
	// console.log('原始数据',datas)
	for (let weekIdx in datas) {
		let data = datas[weekIdx]
		let count = data.length
		let buildIdx = `近${weekIdx[0]}周`;
		res[buildIdx] = {}
		if(count === 0) {
			continue
		}
		// 牌价
		let brand_price = 0
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
			maoriSum+=parseFloat(v['maori'])
			// 得到牌价
			brand_price = v['brand_price']
			// 计算零售总量
			retailSum+=v['retail']

			// 计算周零售单价总计
			if (parseFloat(v['retail_price']) === 0 && v['retail'] == 0) {
				retailPriceSingleSum = 0
			} else {
				retailPriceSingleSum+=parseFloat(v['retail_price'])/v['retail']
			}
			
			retailPriceAmount += parseFloat(v['retail_price']);
			costJiaquanSum+=parseFloat(v['cost_info']['cost_jiaquan'])
		})


		// 库存周平均值
		let stockAve = parseInt(stockSum/count)
		// 周毛利率
		let maoriRate
		if ( maoriSum === 0 && retailPriceAmount === 0 ) {
			maoriRate = 0	
		} else {
			maoriRate = (maoriSum/retailPriceAmount).toFixed(2)
		}
		// 周零售销售价平均值
		let retailPriceAve = retailPriceSingleSum/count
		// 周加权成本平均值
		let costJiaquanAve = costJiaquanSum/count

		res[buildIdx]['库存量'] = stockAve
		res[buildIdx]['周销量'] = retailSum
		res[buildIdx]['周毛利率'] = (maoriRate*100).toFixed(2)
		res[buildIdx]['平均售价'] = retailPriceAve.toFixed(2)
		if( retailSum === 0 ) {
			res[buildIdx]['库销比'] = stockAve.toFixed(2)
		} else {
			res[buildIdx]['库销比'] = (stockAve/(retailSum*4)).toFixed(2)
		}
		res[buildIdx]['效率值'] = ((retailSum/stockAve)*maoriRate/0.0125*100).toFixed(2)
		res[buildIdx]['折扣'] = ((retailPriceAve/brand_price).toFixed(2))*10
		res[buildIdx]['周成本'] = costJiaquanAve.toFixed(2)

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
		})
	}

	return {
		res,
		titles,
		amountTitles,
		amountDatas,
		rateTitles,
		rateDatas
	}
}




const dailyReportCurrentStockTotalComputed = (data)=>{

}




export {
	dailyReportCurrentStockComputed,
	dailyReportCurrentStockTotalComputed,
}