// There's some really cool stuff in the docs, read more about it here
// Documentation: https://laravel.com/docs/5.7/mix

let mix = require( 'laravel-mix' );
mix
	.setResourceRoot( '/' )
	.browserSync( {
		open: true,
		proxy: 'https://p5lab.test',
		notify: true,
		stream: true,
		files: [
			'./dist/js/*',
			'./dist/css/*',
			'./*.html'
		]
	} )
	.webpackConfig( {
		externals: {}
	} )
	.sass( './src/scss/main.scss', './dist/css' )
	.js( './src/js/main.js', './dist/js' )
	.options( {
		processCssUrls: true,
	} )
	.sourceMaps();
