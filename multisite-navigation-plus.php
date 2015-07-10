<?php
/**
 * Plugin Name: Multisite Navigation Plus
 * Description: Makes administering large WordPress multi-site networks easier by sorting the sites alphabetically and displaying the blog ID in the admin bar.
 * Author: Jamie Currie / wunderdojo, LLC
 * Author URI: http://wunderdojo.com
 * Version: 1.0
 * Multisite Navigation Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Multisite Navigation Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * For license details see: <http://www.gnu.org/licenses/>.
 * 
 */
    
//- Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

//- Only load on admin
add_action('init', array('Multisite_Navigation_Plus', 'init'));

if ( ! class_exists( 'Multisite_Navigation_Plus' ) ) :   
    
class Multisite_Navigation_Plus {
    
    private static $_instance = NULL;

    //- Enforce singleton pattern
    public static function init() {
            //- check to make sure we're on a multisite install
            if ( is_multisite() && ! isset( self::$_instance ) && ! ( self::$_instance instanceof Multisite_Navigation_Plus ) ) {
                    self::$_instance = new Multisite_Navigation_Plus;
            }
            return self::$_instance;
    }
    
    //- Add filters when the class is instantiated
    public function __construct(){
        //- Make the admin list of sites in the network be alphabetical - found in wp-includes/user.php line 1220
        add_filter('get_blogs_of_user', array($this, 'sort_my_sites'));
        //- Add the blog ID to the title in the browser nav tab */
        add_filter( 'admin_title', array($this, 'modify_admin_title'));
    }
    
    //- Sorts the list of blogs alphabetically and prepends the blog ID
    function sort_my_sites($blogs) {
        uasort($blogs, function($a, $b){ 
            return strcasecmp($a->blogname, $b->blogname);
        });
        array_walk($blogs, function($blog, $key){
            $blog->blogname = "{$key}. {$blog->blogname}";
        });
        return $blogs;
    }

    //- Adds the blog ID to the browser nav tab
    function modify_admin_title($admin_title){
        return get_current_blog_id().". ".$admin_title;
    }
}

endif; //- end of class_exists check