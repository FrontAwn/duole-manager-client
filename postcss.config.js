const autoprefixer = require('autoprefixer')
const postcssIfMedia = require('postcss-if-media')
const postcssCustomMedia = require('postcss-custom-media')

module.exports = {
	plugins:[
		autoprefixer(),
		postcssIfMedia(),
		postcssCustomMedia({
			// extensions:{
			//     '--large-viewport': '(min-width: 1300px)',
			//     '--desk-viewport': '(min-width: 769px and max-width:992)',
			//     '--phone-viewport': '(max-width: 768px)',
			//     '--small-viewport': '(max-width:414px)',
			// }
		}),
	]
}