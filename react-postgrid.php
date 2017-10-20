<?php
/*
Plugin Name: React Postgrid
Plugin URI: https://brettshumaker.com
Description: Provides a shortcode that renders a posts grid in react. Choose a category and view posts with no page reload. :)
Version: 1.0
Author: Brett Shumaker
Author URI: https://brettshumaker.com/
License: GPLv3
*/

function reactjs_display() {
    return '<div id="react-postgrid-wrap"></div>';
}
add_shortcode( 'react-postgrid', 'reactjs_display' );

add_action( 'wp_enqueue_scripts', 'load_scripts' );
function load_scripts() {
    
    wp_enqueue_script( 'react-js', 'https://unpkg.com/react@15/dist/react.js' );
    wp_enqueue_script( 'react-dom', 'https://unpkg.com/react-dom@15/dist/react-dom.js', array( 'react-js' ) );
	wp_enqueue_script( 'babel', 'https://npmcdn.com/babel-core@5.8.38/browser.min.js', array( 'react-dom') );
	wp_enqueue_script( 'axios', 'https://unpkg.com/axios/dist/axios.min.js', array('react-dom') );
    wp_enqueue_script( 'react-postgrid', plugin_dir_url( __FILE__ ) . 'js/react-postgrid.js', array( 'axios', 'babel' ) );
    
	wp_enqueue_style( 'react-plugin', plugin_dir_url( __FILE__ ) . 'css/react-postgrid.css' );
	
}

add_filter( 'script_loader_tag', 'react_js_plugin_babel_type', 10, 3 );
function react_js_plugin_babel_type( $tag, $handle, $src ) {
	
	if ( $handle !== 'react-postgrid' ) {
		return $tag;
	}

	return '<script src="' . $src . '" type="text/babel"></script>' . "\n";
	
}
