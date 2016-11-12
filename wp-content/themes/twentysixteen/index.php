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
				<input id="houseNo" class="form-control" placeholder="House No." required >
				</div>	
				<div class="col-sm-3"> 
				<input id="postcode" class="form-control" placeholder="Postcode" required >
				</div>	
				<div class="col-sm-3"> 
				<input id="customer_name" class="form-control" placeholder="Name"  required>
				</div>
				<div class="col-sm-3"> 
				<input id="phone" class="form-control" placeholder="Phone" required>
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
	</div><!-- .content-area -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
