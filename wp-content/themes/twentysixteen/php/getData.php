
<?php
/*查询数据库表: any*/
    require_once('../../../../wp-config.php');
	global $wpdb;
	$query  ="Select * from wp_restaurant_orders";
	$gr1 = $wpdb->get_results($query);// 
	//$dishes=($gr1->ord_dish);
	 
	$row=json_encode($gr1);
	//$row=json_encode($dishes);
	echo ($row);
	//echo json_encode($dishes);
	exit;
?>