<?php
   require_once('../../../../wp-config.php');
    
   $user = wp_get_current_user(); 
	/* if ( in_array( 'administrator', (array) $user->roles )==false ) 
	{
		exit;
	} */
	
	global $wpdb;
	
	$table=$_POST['table'];
	 
	$where_clause=array(
		'id'=>$_POST['order_id']
	);
 
	
	//write into log

	$query="select * from ". $table . " where id=" . $_POST['id']; 
	$gr1 = $wpdb->get_row($query);//query origin entry with id 
	$origin=print_r($gr1,true);
	
	$wpdb->delete($table, $where_clause);//update db
	$log="User ID: " . $user->ID . ",";	
    
	//$done=" Delete ";
	$log=$log . " Delete " . $origin  . PHP_EOL . PHP_EOL ;
	write_operation_log($log);
	
	exit;
?> 
