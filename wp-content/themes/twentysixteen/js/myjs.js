var entry=[];//全局变量，保存每一单的餐名和价格
var deliveryCharge=2.5;//默认送餐费
var address="";
//var editFlag=1; // =1 时，默认询问是否删除，还是修改。
$(function () {
	//alert("occcc.");
	var dt = new Date();
	var time = dt.toISOString();   
	var orderID='<br/><span id="orderID" style="text-align:right;font-size:0.7em;" class="hidden"> #'+time+'</span>';
	$(".widget-title a:last").append(orderID); 

});

function addOrder(title,dishPrice)
{
	
	//先显示order ID
	$("#orderID").attr('class',''); 
 
	var price=parseFloat((dishPrice).replace('£',''));
	 
	
	//这里要把title存入一个数组，以判断将来有没有重复的单，如果有，合并，数量+1.
	var row={
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

	$("#sideer_order_title").attr('class','row');
	
    $("#order_cart").empty();
	$("#order_cart").append(orderEntry(entry)).append('<hr/>').append(delivery()).append(totalPrice(entry)).append(addCheckout());
	
	return false;
}

 

//生成1行order记录到sider
function orderEntry(entry)
{
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

 
//添加Check out 按钮到order底部
function addCheckout()
{
	var btn='<button  id="checkOutBtn" onclick="printOrder()" type="button" class="btn btn-success btn-xs">Check Out</button>';
	var checkOut='<br/><div id="checkOut" class="row">'+ btn + '</div>';
	
	console.log("houseNo: "+$("#houseNo").val());
	
	return checkOut;
}

   
//打印sider的订单
function printOrder()
{
	
	if(validation()===true)
	{
		$("#enhancedtextwidget-2").printArea();
		//打印完之后，清空变量	
		entry=[];
		deliveryCharge=2.5;//默认送餐费
	}
	
	
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


