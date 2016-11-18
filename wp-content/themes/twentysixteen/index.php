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
 

<div id="primary" class="content-area" style="border:0px solid red;">
	<ul class="nav nav-tabs">
		<li class="active"><a data-toggle="tab" href="#home">Home点餐 <span class="icon-one-finger-click" style="font-size:1.7em"></span></a></li>
		<li><a data-toggle="tab" href="#menu2">Sit-in <span class="icon-spoon-knife" style="font-size:1.7em"></span></a></li>
		<li><a data-toggle="tab" href="#menu3">History <span class="icon-history" style="font-size:1.7em"></span></a></li>
		<li><a data-toggle="tab" href="#menu4">Help <span class="icon-question-circle" style="font-size:1.7em"></span></a></li>
	</ul>
	
	<div class="tab-content">
		<div id="home" class="tab-pane fade in active"><!--点餐页面tab-->
				<br/>
				<main id="main" class="site-main" role="main">
					<div class="row"> <!--客人信息-->
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
					<?php echo do_shortcode('[wpdreams_ajaxsearchlite]'); //餐搜索栏 ?> 
				 
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
				<?php }  ?> 
			 
		</div><!--end of tab1: #home--->
		
		<!--点餐页面tab 结束-->
		<div id="menu2" class="tab-pane fade"><!--坐台--->
			<br/>
			<div id="jsGridSitin"></div>
			<div id="externalPagerSitin"></div>
		</div><!--end of tab2: menu2 坐台--->
		
		<div id="menu3" class="tab-pane fade"><!-- 历史纪录--->
			<br/>
			<div id="jsGridHistory"></div>
			<div id="externalPagerHistory"></div>
		</div><!--end of tab2: menu3 历史纪录--->
		
		<div id="menu4" class="tab-pane fade"><!--帮助文档--->
		</div><!--end of tab2: menu4 帮助文档--->
		
	</div><!--end of .tab-content--->
</div><!-- .content-area #primary -->

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
					
	</div><!-- .modal-content end -->		  
	</div><!-- .modal-dialog end-->
</div><!-- Modal end-->

<!-- Modal Popup for order details-->
<div class="modal fade" id="ModalOrderAction" role="dialog" data-keyboard="false" data-backdrop="static" style="width:350px;">
	<div class="modal-dialog">
				
		<!-- Modal content-->
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
			</div>
			
			<div class="modal-body" >				  
				<div id="modal-order-action" class="row">
					<div class="col-sm-6">
						<button  id="deleteBtn" onclick="function(){return 'delete';}" type="button" class="btn btn-danger btn-xs"><span class="icon-trash"></span>Delete</button>';
					</div>	
					<div class="col-sm-6">
						<button  id="EditBtn"  onclick="function(){return 'edit';}" type="button" class="btn btn-success btn-xs"><span class="icon-document-edit"></span>Edit</button>';
					</div>				
				</div>			 
			</div>	
		</div><!-- .modal-content end -->
	
	</div><!-- .modal-dialog end-->
</div><!-- Modal end-->
<?php get_sidebar(); ?>
<?php get_footer(); ?>
