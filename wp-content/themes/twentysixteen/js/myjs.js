var entry=[];//全局变量，保存每一单的餐名和价格
var sitin_entry=[];//全局变量，保存每1张桌子的餐名和价格
var deliveryCharge=2.5;//默认送餐费
var serviceCharge=2.0;//默认服务费
var address="";
var sitin_enable=0; //座位单开单中，禁止其他下单方式。
phpUrl = location.origin + "/wp-restaurant/wp-content/themes/twentysixteen/php/";


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
	
	//按tab  显示profile photo href="#menu7"
	$('a[href="#menu3"]').on('shown.bs.tab', function (e) {
	   $("#jsGridHistory").jsGrid("refresh");
	});
});

var records_raw=[];//保存从数据库中获取的原始数据
$().ready(function () {
	
	/********************************************************************Tab3 grid 历史纪录 *****************************************************************************/
	 
	$("#jsGridHistory").jsGrid({
		height : "auto",
		width : "100%",

		filtering: false,
		sorting : true,
		//editing: true,
		inserting: false,
		/**/
		autoload : true,
		pagerContainer : "#externalPagerHistory",
		paging : true,
		//pageLoading: true,
		pageSize : 8,
		pageIndex : 1,
		pageButtonCount : 5,
		 

		deleteConfirm : function (item) {
			 
			deleteRowById(item);//删除数据库中的记录
						
		},
		 
	 
		//db below here----------------------------
		controller : {
			loadData : function () {
				var d = $.Deferred();
				var records=[];//保存从数据库中获取的原始数据
				
				$.ajax({
					 
					url : phpUrl+"getData.php", // read  
					dataType: "json"
				})
				.done(function (response) {
				 
					response.sort(function(a,b){
						var aId = a.id ;
						var bId = b.id; 						
						return ((aId < bId) ? -1 : ((aId > bId) ? 1 : 0)); //按 entry ID 逆序排序。这样显示出来是降序的。
									
					});
					
					var i = response.length;
				 					
					$(response).each(function () {
						var r = response[--i]; //one entry//
						console.log("r: "+r);					
						 				
						var row2 = {
							"id": r.id,
							"date" : r.date,
							"time": r.time,							
							"order_id" : r.order_id,
							"buyer_name" : r.buyer_name,
							"buyer_house_no" : r.buyer_house_no,
							"buyer_postcode" : r.buyer_postcode,
							"ord_dish_raw": r.ord_dish,
							"ord_dish" : function(){								
								return $('<span>')
								.attr('id',r.id)
								.attr('class',"icon-th-menu")
								.css('font-size','1.2em')
								.on('click', function () {								
									showDetail(r);
								});
							
							}, 
							"telephone" : r.telephone,								
							"ord_action" : function(){
								if(r.ord_action==="delivery")
								{
									return '<span class="icon-truck" style="color:#0a7fe4;"></span>';
								}
								if(r.ord_action==="collection")
								{
									return '<span class="icon-shopping-bag" style="color:#101010;"></span>';
								}
								if(r.ord_action==="sitin")
								{
									return '<span class="icon-spoon-knife green"  ></span>';
								}
								
							},
							// r.ord_status: 完成，已付款，正在做
							"ord_status" : function(){
								if(r.ord_status==="0")//正在做
								{
									return '<img style="margin: 0 auto;" width="45%" height="45%" class="img-responsive"  src="'+ location.origin +'/wp-restaurant/wp-content/uploads/2016/11/Preloader_4.gif">';
								}
								if(r.ord_status==="1")//完成 但未付款
								{
									return '<span class="icon-checkmark green" style="font-size:1.2em;"></span>';
								}
								if(r.ord_status==="2")//已付款
								{
									return '<span class="icon-coin-pound" style="font-size:1.5em;color:#b99427;"></span>';
								}
								
							},
							"ord_operator" : r.ord_operator
							/* "operation": function(){
								var id=r.id;
								return $('<span>').attr("class", "icon-trash") //删除按钮
										.css({
											'font-size' : "1.2em",
											'color': "red"
										})
										.on('click',function(){											 
											deleteRowById(r); 
											$("#jsGridHistory").jsGrid("deleteItem", item);
										});
								} */
							};
							
						records.push(row2); 
					});
					records_raw=records;
					d.resolve(records);					
				})
				.fail(function(){
					console.log("jsGrid db load data fail.");
				});
				return d.promise();
			}
		},
		//db above ----------------------------

		fields : [
			{
				name : "ord_status",
				title: "Status",
				type : "text",
				align : "center",
				autosearch : true,
				sorting : true,
				
				width : "auto"
			}, 
			{
				name : "order_id", // 对应数组row中的index
				title : "Order ID",
				type : "text",
				align : "center",
				filtering : false,
				sorting : true,				
				width : "auto"				
			}, 
			{
				name : "buyer_name", // 对应数组row中的index
				title : "Name",
				type : "text",
				align : "center",
				filtering : false,
				sorting : true,
				width : "auto"
				
			}, 
			{
				name : "buyer_house_no", 
				title : "House NO.",
				type : "text",
				align : "center",				 
				filtering : false,
				sorting : false,
				width : "auto"
				
			},
			{
				name : "buyer_postcode", //name对应数据库中字段
				title: "Postcode",
				type : "text",
				align : "center",
				
				autosearch : true,
				sorting : true,
				width : "auto"
			},	
				 
			{
				name : "telephone",
				title: "Phone",
				type : "text",
				align : "center",
				autosearch : true,
				sorting : false,
				
				width : "auto"
			},			
			{
				name : "ord_action",
				title: "Type",
				type : "text",
				align : "center",
				
				autosearch : true,
				sorting : false,
				width : "auto"
			}, 
		
			/* {
				name : "ord_operator",
				title: "Operator",
				type : "text",
				align : "center",
				autosearch : true,
				sorting : false,
				
				width : "auto"
			}, */
			{
				name : "ord_dish",
				title : "Detail",
				type : "text",
				align : "center",
				filtering : false,
				sorting : false,				
				width : "auto"
			},	
			/* {
				name : "operation",
				title : "Action",
				type : "text",
				align : "center",
				filtering : false,
				sorting : false,				
				width : "auto"
			}, */
			{
				type : "control",
				 
				editButton : false,
				deleteButton :  true,
				//deleteButton : false,//为了展示，先暂时关闭
				clearFilterButton : false,
				modeSwitchButton : false,
				width : "auto",

				headerTemplate : function () {
					
					return $("<span/>").attr("class", "icon-tools2") //Tab1
					.css({
						'font-size' : "1.5em",
						'color' : "#101010"
					});
				}
			}
				

		]

	});
		
/****************************************************************************Tab2 grid end****************************************************************************/
	
});

/* function showOrderDetails(r)
{
	var dishDetails='';									
	dishEntry= $.parseJSON( r.ord_dish );
	$(dishEntry).each(function(i){
		dishDetails += dishEntry[i].dish_qty  + " x "
		+ dishEntry[i].dish_name + "  £"
		+ dishEntry[i].dish_price + "\n\n";
	});

	if(r.ord_action==='delivery')
	{
		orderAction='<span class="icon-truck"></span>';
	}
	else if(r.ord_action==='collection')
	{
		orderAction='<span class="icon-shopping-bag"></span>';
	}
	else if(r.ord_action==='sitin')
	{
		orderAction='<span class="icon-spoon-knife"></span>';
	}
	var header='<div class="modal-header">'
			+'<button type="button" class="close" data-dismiss="modal">&times;</button>'
			+'<div class="row"> <!--桌牌号码-->'
				+'<div class="col-sm-6 col-sm-offset-3">'
					+ orderAction +' Order NO.:# '+ r.ord_id					
				+'</div>'
			+'</div>'
		+'</div>';
		
	var body='<div class="modal-body" >'
			+'<div id="modal-buyer-info" class="row" style="padding:0px 8px;margin: 1px 2px;">'
						
			+'</div>'
			+'<div id="modal-table-orders" class="row" style="padding:0px 8px;margin: 1px 2px;">'
						
			+'</div>'
			+'<div id="modal-table-total" class="row" style="padding:0px 8px;">'
							
			+'</div>'
		+'</div>';
} */

//History 页面的jsgrid 显示order detail 到sider
function showDetail(r)
{
	//这里要把title存入一个数组，以判断将来有没有重复的单，如果有，合并，数量+1.
	dishEntry= $.parseJSON( r.ord_dish );
	 
	//打印前让我先看看order变量里都有啥
	console.log("都有啥: ");
	console.log(r); 
	$("#waiting_pic").css('display','none');//隐藏 等待动画
	$("#order_cart").empty();
	$("#sideer_order_title").attr('class','row');	
	buyerInfo(r);
	console.log("都action: ");
	console.log(r.ord_action); 	
	
	if(r.ord_action === 'delivery')// takeaway 或 phone order，订单添加到侧边栏。
	{		 
		$(".widget-title").html('<a href="#">Order <span class="icon-truck"></span></a>'); 
		$("#order_cart").append(orderEntry(dishEntry)).append('<hr/>').append(delivery()).append(totalPrice(dishEntry)).append(addCheckout());
	}
	else if(r.ord_action === 'sitin')//座位单开单中，订单添加到Modal中。
	{	
		$(".widget-title").html('<a href="#">Order <span class="icon-spoon-knife"></span></a>'); // 
		$("#order_cart").append(orderEntry(dishEntry)).append('<hr/>').append(serviceFee()).append(totalPrice(dishEntry)).append(addCheckout()); //不需要delivery因为是sit-in
	}
	else if(r.ord_action === 'collection')
	{
		$(".widget-title").html('<a href="#">Order <span class="icon-shopping-bag"></span></a>'); // 
		$("#order_cart").append(orderEntry(dishEntry)).append('<hr/>').append(totalPrice(dishEntry)).append(addCheckout());
	}
}
 
 //显示客户信息到title
 function buyerInfo(r)
 {
	$("#iconUser").attr('class',"icon-user2 ");
	$("#iconHome").attr('class',"icon-home3 ");
	$("#iconPhone").attr('class',"icon-phone");
		
	$("#buyer_name").text(r.buyer_name);
	$("#buyer_address").text(r.buyer_addr);
	$("#buyer_phone").text(r.telephone);
 }
 
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
	$("#waiting_pic").css('display','none');//隐藏 等待图标
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
					<div class="col-sm-3" style="text-align:right;">£' + parseFloat(entry[index].dish_price).toFixed(2) +
					'</div></div>';
	});
	return dishEntry;
} 

//当点击每一条记录时，询问删除还是修改？
function entryAction(ele_id,index)
{

	/* if($("#"+ele_id).attr('contenteditable')=="undefined")
	{
		console.log("undefined3424");
	} */		
 
	bootbox.confirm({
			message: "Delete or Edit ?",
			buttons: {
				confirm: {
					label: '<span class="icon-trash"></span> Delete',
					className: 'btn-danger '
				},
				cancel: {
					label: '<span class="icon-document-edit"></span> Edit',
					className: 'btn-success'
				}
			},
			callback: function (result) {
				console.log('This was logged in the callback: ' + result);
				if (result == true) 
				{
					delete1Entry('entry-'+index);
				} 
				else 
				{
					bootbox.hideAll();
					 
					$("#"+ele_id).css('border',"1px solid red");
					$("#"+ele_id).attr('contenteditable',true);
					temp=$("#"+ele_id).html();
					$("#"+ele_id).html(temp+'&nbsp;');
					$("#"+ele_id).focus();
					placeCaretAtEnd( document.getElementById(ele_id));	//focus at end of the text in div	
				}
			}
	}); 	
	 

}

//focus at end of text div
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
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
		 
		sum += parseFloat(entry[index].dish_price) ;
	});
	var total='<div class="row">\
						<div class="col-sm-4">' +
						'</div>\
						<div class="col-sm-4" style="text-align:center; ">Total: </div>\
						<div class="col-sm-4" style="text-align:right; ">£'+(sum + deliveryCharge).toFixed(2)+'</div>\
					</div>';
	return total;
}

//添加运费 到order底部
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

//添加服务费 到order底部
function serviceFee()
{
	var deliveryFee='<div id="serviceRow" class="row">\
						<div class="col-sm-4">' +
						'</div>\
						<div class="col-sm-4" style="text-align:center; ">Service Fee: </div>\
						<div class="col-sm-4" id="deliveryCharge" style="text-align:right; ">£'+serviceCharge.toFixed(2)+'</div>\
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
	var btn1='<button  id="ordSubmit" onclick="orderSubmit()" type="button" class="btn btn-primary btn-xs">Save</button>';
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
			'customer_address': $("#buyer_address").val(),
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

//删除DB中一条记录
function deleteRowById(r){
	 
	$.ajax({
		type: "POST",
		url: phpUrl+'deleteRowById.php',
		data:{'order_id':r.id,
		'table':'wp_restaurant_orders'}
	})
	.done(function(r){
		console.log("delete it");
		$("#jsGridHistory").jsGrid("refresh");
		console.log("refresh it");
		 
	})
	.fail(function(){
		console.log("cannot delete it.");
	});
	 
}