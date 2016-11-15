<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

get_header(); ?>
	
	<br/>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

		<?php if ( have_posts() ) : ?>

			<?php if ( is_home() && ! is_front_page() ) : ?>
				<header>
					<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
				</header>
			<?php endif; ?>
			
			<div class="row"> 
			<form class="form-class">
				<div class="col-sm-2"> 
				<select class="form-control" id="order_action" onclick="set_order_action_icon()" name="order_action" style="text-transform: capitalize;" required>								
					<?php $gr = ($wpdb->get_results("SELECT * FROM wp_restaurant_order_action ")); ?>
					<?php foreach ( $gr as $val ) : ?>
					<option value="<?php echo $val->id?>"><?php echo $val->order_action?></option>
					<?php endforeach; ?>								 
				</select>
				</div>
				<div class="col-sm-2"> 
				<input id="houseNo" class="form-control" placeholder="House No." required >
				</div>	
				<div class="col-sm-2"> 
				<input id="postcode" class="form-control" placeholder="Postcode" required >
				</div>	
				<div class="col-sm-2"> 
				<input id="customer_name" class="form-control" placeholder="Name"  required>
				</div>
				<div class="col-sm-3"> 
				<input id="phone" type="number" class="form-control" placeholder="Phone" required>
				</div>	
				
				<div class="col-sm-1"> 
				<a onclick="return getAddress()"><span class="icon-plus-alt addrplusicon_green"></span></a>
				</div>				
			</form>
			</div>
			<br/>
			<?php echo do_shortcode('[wpdreams_ajaxsearchlite]'); //ajax search box ?>
		<?php endif;?>
		 
		</main><!-- .site-main -->  
		
		<!--桌子区--->
		<?php for ($row = 1; $row <= 3; $row++) { ?>
		<div class="row">
			<?php
				for ($i = 1; $i <= 6; $i++) {
					echo '<div class="col-sm-2 portfolio-item">';
					echo '<span class="table_label">'.($i+($row-1)*6).'</span>';
					echo '<img class="img-responsive tableimg" onclick="table_checkout(this)" src="'. get_site_url().'/wp-content/uploads/2016/11/kitchen_table.png" alt="">';
					echo '</div>';
				} 
			?>
		</div><!--桌子区 结束 --->
		
		<!-- Modal Popup-->
		<div class="modal fade" id="myModal" role="dialog" data-keyboard="false" data-backdrop="static" style="width:350px;">
			<div class="modal-dialog">
			
			  <!-- Modal content-->
			  <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal">&times;</button>
				  <div class="row"> <!--桌牌号码-->
					<div class="col-sm-6 col-sm-offset-3">
						<div id="modal-table-num" class="table_label" style="margin:0 0;width:auto;"></div>
					</div>
				  </div>
				</div>
				<div class="modal-body" >				  
					<div id="modal-table-orders" class="row" style="padding:0px 8px;margin: 1px 2px;">
					
					</div>
					<div id="modal-table-total" class="row" style="padding:0px 8px;">
						
					</div>
				</div>
				
				<!--button type="button" class="btn btn-default" data-dismiss="modal">Check Out</button-->
				<div id="sitinOrderID" class="row">						
				</div>
				
			  </div><!-- Modal content end -->
			  
			</div>
		</div><!-- Modal end-->
		<?php } ?> 
	</div><!-- .content-area -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
