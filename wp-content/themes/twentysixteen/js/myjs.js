var entry=[];//全局变量，保存每一单的餐名和价格
var sitin_entry=[];//全局变量，保存每1张桌子的餐名和价格
var deliveryCharge=2.5;//默认送餐费
var address="";
var sitin_enable=0; //座位单开单中，禁止其他下单方式。
phpUrl = location.origin + "/wp-restaurant/wp-content/themes/twentysixteen/php/";
console.log(phpUrl);
/*-------------------------------------------------------------------------------------------*/
$(function () {
	//如何选择 
	//$(".widget-title>a").text("Order ("+ $( "#order_action option:selected" ).text() +")");
	
	//页面初次加载时，显示送餐icon
	if($("#order_action option:selected").val()==='1')
	{
		$(".widget-title").html('<a href="#">Order <span class="icon-truck"></span></a>'); //重新设置 $(".widget-title") 内部元素，添加orderaction对应的icon
	}
	if($("#order_action option:selected").val()==='2')
	{
		$(".widget-title").html('<a href="#">Order <span class="icon-shopping-bag"></span></a>'); //重新设置 $(".widget-title") 内部元素，添加orderaction对应的icon
	}
	
});

//显示送餐/自取图标到侧边栏的order后面
function set_order_action_icon( )
{
	//console.log($("#order_action").val());
	if($("#order_action").val()==='1')
	{
		$(".widget-title").html('<a href="#">Order <span class="icon-truck"></span></a>'); //重新设置 $(".widget-title") 内部元素，添加orderaction对应的icon
	}
	if($("#order_action").val()==='2')
	{
		$(".widget-title").html('<a href="#">Order <span class="icon-shopping-bag"></span></a>'); //重新设置 $(".widget-title") 内部元素，添加orderaction对应的icon
	}
}

//生成order ID
function newOrderId(){
	var dt = new Date();
	var time = dt.toISOString();   
	var orderID='<br/><span id="orderID" style="text-align:right;font-size:0.7em;" class="hidden"> #'+time+'</span>';
	$(".widget-title a:last").append(orderID); 
	return time;//返回值类似：2016-11-14T00:17:37.620Z
}

//点击 搜索结果后面的 plus icon 的动作
function addOrder(id,title,dishPrice)
{ 
		var price=parseFloat((dishPrice).replace('£',''));
		
		//这里要把title存入一个数组，以判断将来有没有重复的单，如果有，合并，数量+1.
		var row={
			'dish_id':id,
			'dish_name':title,
			'dish_qty':1,
			'dish_price':price,
		};
		if(entry.length>0) //如果存在。
		{   var sum_price=0;
			$(entry).each(function(index){
				if(entry[index].dish_name===title) //如果 找到相同的，自加。
				{				
					entry[index].dish_qty += 1;			 
					entry[index].dish_price = parseFloat(entry[index].dish_price + price);
				 
					return false;
				}
				if(index==entry.length-1) //如果找到最后都没找到。
				{
					entry.push(row);
				}
			});
		}
		else{
			entry.push(row);
		}
		
		//打印前让我先看看order变量里都有啥
		console.log("打印前让我先看看变量里都有啥: ");
		console.log(entry); 
		
	if(sitin_enable===0)// takeaway 或 phone order，订单添加到侧边栏。
	{
		$("#sideer_order_title").attr('class','row');		
		$("#order_cart").empty();
		$("#order_cart").append(orderEntry(entry)).append('<hr/>').append(delivery()).append(totalPrice(entry)).append(addCheckout());
	}
	else if(sitin_enable===1)//座位单开单中，订单添加到Modal中。
	{
		$("#modal-table-orders").empty();
		$("#modal-table-orders").append(orderEntry(entry)).append('<hr/>').append(totalPrice(entry)).append(addCheckoutSitin()); //不需要delivery因为是sit-in
	}
	
	
	return false;
}

 

//生成1行order记录到sider
function orderEntry(entry)
{
	$("#waiting_pic").css('display','none');//隐藏 等待动画
	var dishEntry = '';
	$(entry).each(function(index){
		if(index%2===0)
		{
			background=" bgcolor";//leave space ahead
		}
		else{
			background='';
		}
		dishEntry +='<div id="entry-'+index+'" class="row'+background+'">\
					<div class="col-sm-7" id="dishName-'+index+'" onclick="entryAction(this.id,'+index+')"><span id="trashIcon" class="icon-trash red"></span> ' + entry[index].dish_name +
					'</div>\
					<div class="col-sm-2" id="dishQty-'+index+'" onclick="entryEdit(this.id)" style="padding:0 0;text-align:center;">' + entry[index].dish_qty +
					'</div>\
					<div class="col-sm-3" style="text-align:right;">£' + entry[index].dish_price.toFixed(2) +
					'</div></div>';
	});
	return dishEntry;
} 

//当点击每一条记录时，的操作。
function entryAction(ele_id,index)
{
	console.log("element ID: "+ele_id+" , Index: "+ index);
	var entryContent= $("#entry-"+index).text().replace(/\s+/g, ', ');//replace(/^\s+|\s+$/gm,'');
	entryContent=entryContent.replace(/,/g, ' ');	
	console.log(entryContent);
	var r = confirm(entryContent+"\n\nPress [OK] to delete, or Press [Cancel] to Edit.\n请点击 [OK] 删除这条记录，或点击 [Cancel] 修改这条记录。");
	if (r == true) 
	{
		delete1Entry('entry-'+index);
	} 
	else 
	{
		$("#"+ele_id).attr('contenteditable',true);
		$("#"+ele_id).focus();			
	}
 	
}

//当点击每一条记录时，修改操作。
function entryEdit(ele_id)
{
	$("#"+ele_id).attr('contenteditable',true);
}

//删除一条记录
function delete1Entry(id)
{
	$("#"+id).attr('style','display:none;');
}

//计算1张单的总价格
function totalPrice(entry)
{
	var sum = 0;
	$(entry).each(function(index){
		 
		sum += entry[index].dish_price ;
	});
	var total='<div class="row">\
						<div class="col-sm-4">' +
						'</div>\
						<div class="col-sm-4" style="text-align:center; ">Total: </div>\
						<div class="col-sm-4" style="text-align:right; ">£'+(sum + deliveryCharge).toFixed(2)+'</div>\
					</div>';
	return total;
}

//添加运费按钮到order底部
function delivery()
{
	var deliveryFee='<div id="deliveryChargeRow" class="row">\
						<div class="col-sm-4">' +
						'</div>\
						<div class="col-sm-4" style="text-align:center; ">Delivery: </div>\
						<div class="col-sm-4" id="deliveryCharge" style="text-align:right; ">£'+deliveryCharge.toFixed(2)+'</div>\
					</div>';
	return deliveryFee;
} 


//显示客人住址 并 计算运费。 
/*get location information by postcode*/
function getAddress()
{	
	var houseNo=$("#houseNo").val();
	var postcode=$("#postcode").val()+",uk";
	//alert(postcode);
	var url="http://maps.googleapis.com/maps/api/geocode/json?address="+postcode+"&sensor=false";
	
	$.ajax(
	{
		url: url,
        dataType: "json"
	})
	.done(function(response){ 		
		 
		var addr= houseNo +" "+ response.results[0].formatted_address;
		console.log(addr);
	 
		
		$("#iconUser").attr('class',"icon-user2 ");
		$("#iconHome").attr('class',"icon-home3 ");
		$("#iconPhone").attr('class',"icon-phone");
		
		$("#buyer_name").text($("#customer_name").val());
		$("#buyer_address").text(addr);
		$("#buyer_phone").text($("#phone").val());
		return false;
	})
	.fail(function(){ 
		alert("Check your postcode, is it RIGHT?"); 
		console.log(postcode);
	});
	return false;
}

 
//添加Check out 按钮到侧边栏order底部
function addCheckout()
{
	var btn1='<button  id="ordSubmit" onclick="orderSubmit()" type="button" class="btn btn-primary btn-xs">Submit</button>';
	var btn2='<button  id="checkOutBtn" onclick="printOrder()" type="button" class="btn btn-success btn-xs">Check Out</button>';
	//var checkOut='<br/><div id="checkOut" class="row">'+ btn + '</div>';
	var checkOut='<br/><div class="row">'
			+ '<div class="col-sm-6">'
			+ btn1
			+ '</div>'	
			+ '<div id="checkOut" class="col-sm-6">'
			+ btn2
			+ '</div>'	
		+ '</div>';
		
	return checkOut;
}


//添加Check out 按钮到Modal 座位单order底部
function addCheckoutSitin()
{
	var btn1='<button  id="previewBtn" onclick="printSitinOrder()" type="button" class="btn btn-primary btn-xs">Preview</button>';
	var btn2='<button  id="checkOutBtn" onclick="printSitinOrder()" type="button" class="btn btn-success btn-xs">Check Out</button>';
	var checkOut='<br/><div class="row">'
			+ '<div class="col-sm-6">'
			+ btn1
			+ '</div>'	
			+ '<div id="checkOut" class="col-sm-6">'
			+ btn2
			+ '</div>'	
		+ '</div>';
	return checkOut;
}

   
//打印sider的订单
function printOrder()
{	
	if(validation()===true)
	{
		//mark as finished in db
		
		$("#enhancedtextwidget-2").printArea();
		//打印完之后，清空变量	
		entry=[];
		deliveryCharge=2.5;//默认送餐费
	}
}

//creat sitin order id
function newOrderIdSitin()
{
	var dt = new Date();
	var time = dt.toISOString();   
	var orderID='<br/><div class="col-sm-10 col-sm-offset-1">Order ID: #'+time+'</div>';
	return orderID;
}

//打印Modal的Sitin订单
function printSitinOrder()
{
	//$("#sitinOrderID").empty();
	$("#sitinOrderID").append(newOrderIdSitin());	
	$("#myModal").printArea();
	//打印完之后，清空变量	??????
	entry=[];	
}

//检查客人地址电话是否填写完整
function validation()
{
	if($("#houseNo").val()===''||$("#postcode").val()===''||$("#phone").val()==='')
	{
		//$("#houseNo").attr('style',"border:2px solid red;");
		alert("Please fill in customer address, telephone number, and name. \n请填写客人信息。");
		return false;
	}
	else{
		getAddress();
		return true;
	}
	
	 
}

//结算sit-in
function table_checkout(clicked)
{
	sitin_enable=1;
	$(".widget-title").html('<a href="#">Order <span class="icon-shop"></span></a>'); //重新设置 $(".widget-title") 内部元素，添加orderaction对应的icon
	
	$(clicked).css('filter','grayscale(0%)');//翻桌变亮
	$(clicked).css('-webkit-filter', 'grayscale(0%)');//翻桌变亮 /* Safari 6.0 - 9.0 */
	var tableNO=$(clicked).siblings().text();//桌号
	$("#myModal").draggable({
		handle: ".modal-header"
	});
	$('#myModal').modal('show');
	 
	$('#modal-table-num').text("Tabel: "+tableNO);
	
	//sitin_enable=0; //座位单开单完毕。这个要写在close中
}

/*----------------------------------------------------------------------------------数据库访问函数-----------------------------------------------------------------*/

//提交单到数据库
function orderSubmit()
{
	var orderId = newOrderId();//为此单创建order ID
	$("#orderID").attr('class',''); //显示order id，默认是hidden
		
	$.ajax({
		type: "POST",
		url: phpUrl+'insertOrder.php',
		data:{'order_id':orderId,
			'order_action': $("#order_action option:selected").text(),
			'house_no': $("#houseNo").val(),
			'postcode': $("#postcode").val(),
			'customer_name': $("#customer_name").val(),
			'phone': $("#phone").val(),
			'order_entry':entry
			},
		dataType: 'json'
	})
	.done(function(data){
		console.log(data);
	})
	.fail(function(data){
		console.log(data);
	});
}