<?php
    require_once('../../../../wp-config.php');    
	global $wpdb;
    $current_user = wp_get_current_user();
	/* if(!($current_user->ID))
	{
		exit;
	} */
	
    $table = "wp_restaurant_orders";
	
	$query="select id from wp_restaurant_orders WHERE order_id =". $_POST['order_id'];
	$gr = $wpdb->get_row($query);// 
	 
	if($gr->id)
	{//如果id已经存在，则更新
		;
	}
	else{//如果id不存在，则新增。
		 
		$str = $_POST['order_id'];//2016-11-14T00:17:37.620Z
		$ordDate = substr($str,0,strpos($str,'T'));
		$ordTime = substr($str,strpos($str,'T')+1,8);	
		
		$data_array = array(
			'order_id' => $_POST['order_id'], 
			'date' => $ordDate , 
			'time' => $ordTime ,
			'buyer_name' =>  $_POST['customer_name'],
			'buyer_house_no' =>  $_POST['house_no'],
			'buyer_postcode' =>  $_POST['postcode'],			 
			'buyer_addr' =>  $_POST['house_no'].' '.$_POST['customer_address'],			 
			'telephone' => $_POST['phone'],			
			'ord_dish' => json_encode($_POST['order_entry']), //use serialize() to store it in a database at the end of the request.
			'ord_action' => $_POST['order_action'], // delivery, collection, sit-in 
			'ord_status' => 'open',	// open, suspend, paid
			'ord_operator' => $current_user->ID 			 	
		);
		$wpdb->insert($table,$data_array);
	}
	
	$row=json_encode($data_array);
	echo ($row);
	exit;
?> 
