
var DataList=null;
var selectedItem=null;
var AttributeCategoryList=null;
var AttributeCategorytypeList=null;
var _Optext_Id=1;
function MasterAttribute(_selectedItem)
{
	selectedItem=_selectedItem;
	jQuery.ajax({
		url: "dataType/",
		async:false,
		success: function (data) {
			DataList = data;    

		}
	});

	jQuery.ajax({
		url: "attribcategory/",
		async:false,
		success: function (data) {
			AttributeCategoryList = data;    

		}
	});
	
	jQuery.ajax({
		url: "attribcategoryType/",
		async:false,
		success: function (data) {
			AttributeCategorytypeList = data;    

		}
	});
	
	displayRefreshedMasterAttr('All');
}

function displayRefreshedMasterAttr(_attrcategory)
{

	jQuery.ajax({
		url: "masterattrib/",
		success: function (data) {

			jQuery("#masterattribute-div").empty();

			jQuery.get("resources/templates/studio/" + selectedItem + ".html", function (template) {

				jQuery("#masterattribute-div").append(template);

				jQuery('#masterAttrFormDiv').css("visibility", "visible");		    			    	

				$("#masterAttr_category").val(_attrcategory);

				jQuery("#masterAttrDetails").hide();	        	
				jQuery("#masterAttrsRowData").empty();

				jQuery("#masterAttrTable").show();	        	
				jQuery("#masterAttr_accordion").hide();		    	

				jQuery("#masterAttrTemplate").tmpl(data).appendTo("#masterAttrsRowData");

				jQuery("#masterAttr_btnNew").show();

				jQuery.each(DataList, function (i, _dataobj) {
					if(DataList[i].datatypeId!=5){
						jQuery("#type").append(jQuery("<option></option>").attr("value", _dataobj.datatypeId).text(_dataobj.datatype)); 
					}
				}); 
				

				 jQuery("#category_sel").append(jQuery("<option></option>").attr("value", "").text("Select value"));
				 
				jQuery.each(AttributeCategoryList, function (i, _categoryobj) { 
					//jQuery("#category").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName)); 
					jQuery("#category_sel").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName));
				}); 
				
				
				jQuery("#category_type").append(jQuery("<option></option>").attr("value", 0).text("All"));

				jQuery.each(AttributeCategorytypeList, function (i, _categoryTypeobj) { 
					jQuery("#category_type").append(jQuery("<option></option>").attr("value", _categoryTypeobj.categorytypeid).text(_categoryTypeobj.typename));
					jQuery("#category_type_sel").append(jQuery("<option></option>").attr("value", _categoryTypeobj.categorytypeid).text(_categoryTypeobj.typename));
					
				}); 


				$("#masterAttrTable").tablesorter({ 
					headers: {8: {sorter: false  },  6: {  sorter: false } },	
					debug: false, sortList: [[0, 0]], widgets: ['zebra'] })
					.tablesorterPager({ container: $("#masterAttr_pagerDiv"), positionFixed: false })
					.tablesorterFilter({ filterContainer: $("#masterAttr_txtSearch"),                           
						filterColumns: [0],
						filterCaseSensitive: false
					});
			});		
		}
	});
}

function changeMandatoryValue(_this) {
	if ($('#mandatory').attr('checked')) {

		jQuery('#mandatory').val("true");
	}
	else {

		jQuery('#mandatory').val("false");
	}

}

function addoptionDiv()
{
	
	
	$("#option_typeId").append("<label for=''> Option </label>  <input type='text'  id="+_Optext_Id+"   name='selected_options' /><br>");
	_Optext_Id=_Optext_Id+1;
	
	
}

function changeDataType(_this)
{
	var _id=_this.value;
	
	if(_id==6)
	{
		$("#my_option_divId").show();
		
	}else{
		$("#my_option_divId").hide();
	     $("#option_typeId").empty();
	}
}

function changeCatType(_this)
{
	var _id=_this.value;
		
     if (_id !="") {
        URL = "attribcategoryById/" + _id;
	    jQuery.ajax({
		url: URL,
		async:false,
		success: function (data) {
			
			 $("#category").empty();
			 jQuery("#category").append(jQuery("<option></option>").attr("value", "").text("Select value"));
				jQuery.each(data, function (i, _categoryobj) { 
					jQuery("#category").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName));
				}); 
				
			

		}
	    });
		
     }
      
	 
	
	

	
}

function displaymasterAttr(){

	jQuery("#masterAttr_accordion").hide();


	jQuery("#masterAttrTable").show();
	jQuery("#masterAttr_btnNew").show();
}

var savemasterAttrData= function () 
{	



	jQuery.ajax({
		type: "POST",              
		url: "masterattrib/create" + "?" + token,
		data: jQuery("#addAttributeformID").serialize(),
		success: function (result) 
		{       
			if(result=='true')
			{
				jAlert('Data Successfully Saved', 'MasterAttribute');
				displayRefreshedMasterAttr();
				attrDialog.dialog("destroy");
				$('body').find("#attribute-dialog-form").remove();
				$("#attribute-dialog-form").remove();
			}
			else  if(result=='duplicate')
			{
				jAlert('Duplicate alias/fieldname', 'MasterAttribute');


			}
			else  if(result=='false')
			{
				jAlert('Error in saving data', 'MasterAttribute');	
				//attrDialog.dialog("destroy");


			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {

			alert('err.Message');
		}
	});

}

function savemasterAttr()
{	
	$("#addAttributeformID").validate({
		rules: {
			alias: "required",
			fieldName: "required",
			type: "required",
			size: {

				required: true,
				number: true,
				min : 1
			},
			category_type_sel:"required",
			category: "required",
			
			

		},
		messages: {
			alias: "Please enter Alias Name",
			fieldName: "Please enter  Field Name",
			type: "Please enter Attribute Type",
			size: "Please enter Numeric Attribute Size",
			category_type_sel:"Please enter  Category Type",
			category: "Please enter  Category",
			
		}

	});

	if ($("#addAttributeformID").valid())
	{


		savemasterAttrData();

	}
} 

var deleteAttribute= function (id,alias) 
{	
	jConfirm('Are You Sure You Want To Delete : <strong>' + alias + '</strong>', 'Delete Confirmation', function (response) {

		if (response) {
			jQuery.ajax({          
				type: 'GET',
				url: "masterattrib/delete/"+id,
				success: function (result) 
				{ 
					if(result==true)
					{
						jAlert('Data Successfully Deleted', 'MasterAttribute');	                  
						displayRefreshedMasterAttr();
					}

					if(result==false)

					{

						jAlert('Data Can not be deleted..Used by Project', 'MasterAttribute');	                  
						displayRefreshedMasterAttr();

					}
				},


				error: function (XMLHttpRequest, textStatus, errorThrown) 
				{	                    
					jAlert('Error in Deleting Data', 'MasterAttribute');
				}
			});
		}

	});

}
function  displaySelectedCategory (id) 
{	

	if(id==0)

	{

		displayRefreshedMasterAttr('All');

	}


	if(id!=0)	
	{

		jQuery.ajax({          
			type: 'GET',
			url: "masterattrib/display/"+id,

			success: function (categorydata) { 	


				if(categorydata!='')
				{
					jQuery("#masterAttrsRowData").empty();
					jQuery("#masterAttrTemplate").tmpl(categorydata).appendTo("#masterAttrsRowData");

					$("#masterAttrTable").tablesorter({ 
						headers: {5: {sorter: false  },  7: {  sorter: false } },	
						debug: false, sortList: [[0, 0]], widgets: ['zebra'] })
						.tablesorterPager({ container: $("#masterAttr_pagerDiv"), positionFixed: false })
						.tablesorterFilter({ filterContainer: $("#masterAttr_txtSearch"),                           
							filterColumns: [0],
							filterCaseSensitive: false,
							filterWaitTime:1000 
						});


				}

				else
				{

					jAlert("No Data Available","Message");
				}
			},

		});
	}

}


function displaySelectedCategoryBytype(id)
{
	var URL = "attribcategory/";
     if (id !=0) {
        URL = "attribcategoryById/" + id;
     }
      
	 
		jQuery.ajax({
		url: URL,
		async:false,
		success: function (data) {
			
			 $("#category_sel").empty();
			 jQuery("#category_sel").append(jQuery("<option></option>").attr("value", "").text("Select value"));
				jQuery.each(data, function (i, _categoryobj) { 
					jQuery("#category_sel").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName));
					
				}); 
				
			

		}
	});
		
	
	
}

function cancelMasterAttr()
{
	displayRefreshedMasterAttr();
	attrDialog.dialog("destroy");
	$('body').find("#attribute-dialog-form").remove();
	$("#attribute-dialog-form").remove();


}

function editmasterAttr(id)
{

	jQuery.ajax({
		url: "masterattributes/"+id,
		async:false,
		success: function (data) {

			jQuery("#primeryky").val(data[0].attributemasterid);
			jQuery("#alias").val(data[0].fieldaliasname);
			jQuery("#alias_other").val(data[0].fieldaliasname);
			jQuery("#fieldName").val(data[0].fieldname);
			jQuery("#size").val(data[0].size);


           if(data[0].laExtAttributecategory.attributecategoryid >=1 && data[0].laExtAttributecategory.attributecategoryid<=8 ){

			jQuery.ajax({
			url: "attribcategoryById/1",
			async:false,
			success: function (objattribute) {
			
			
			 $("#category").empty();
			 jQuery("#category").append(jQuery("<option></option>").attr("value", "").text("Select value"));
				jQuery.each(objattribute, function (i, _categoryobj) { 
					jQuery("#category").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName));
					
						}); 
					jQuery("#category").val(data[0].laExtAttributecategory.attributecategoryid); 
               $("#category_type_sel").val(1);	
					

				}
			});
	
			   

			 }
			 if(data[0].laExtAttributecategory.attributecategoryid >=9 && data[0].laExtAttributecategory.attributecategoryid<=13 ){
                 
		 jQuery.ajax({
			url: "attribcategoryById/2",
			async:false,
			success: function (objattribute) {
			
			
			 $("#category").empty();
			 jQuery("#category").append(jQuery("<option></option>").attr("value", "").text("Select value"));
				jQuery.each(objattribute, function (i, _categoryobj) { 
					jQuery("#category").append(jQuery("<option></option>").attr("value", _categoryobj.attributecategoryid).text(_categoryobj.categoryName));
					
						}); 
						
						
				jQuery("#category").val(data[0].laExtAttributecategory.attributecategoryid);  
				 $("#category_type_sel").val(1);

						
					

				}
			});
			
				 
			 }
			$('#category_type_sel').attr("disabled", true); 

			/*jQuery("#mandatory").val("false");*/
			//console.log(data[0].mandatory);
			jQuery("#mandatory").prop("unchecked", "false");
			if(data[0].mandatory==true){
				jQuery("#mandatory").val("true");
				jQuery("#mandatory").prop("checked", "true");
			}
			jQuery("#type").val(data[0].laExtAttributedatatype.datatypeId);
			
			if(data[0].laExtAttributedatatype.datatypeId==6){
				$("#my_option_divId").show();
				_Optext_Id =1;
			   jQuery.each(data[0].options, function (i, obj) { 
				   $("#option_typeId").append("<label for=''> Option </label>  <input type='text'  id="+_Optext_Id+"   name='selected_options' value="+obj.optiontext+" /><br>");
				  _Optext_Id=_Optext_Id+1;
					
				}); 


				
				
			  
	
			}
		}
	});






	attrDialog = $( "#attribute-dialog-form" ).dialog({
		autoOpen: false,
		height: 350,
		width: 325,
		resizable: true,
		modal: true,

		buttons: {
			"Udpate": function() 
			{

				updateEditAttribute();



			},
			"Cancel": function() 
			{
				cancelMasterAttr();
			}
		},
		close: function() {
			cancelMasterAttr();

		}
	});

	attrDialog.dialog( "open" );	


}

function updateEditAttribute()
{

	$("#addAttributeformID").validate({
		rules: {
			alias: "required",
			fieldName: "required",
			type: "required",
			size: {

				required: true,
				number: true,
				min : 1
			},
			category_type_sel:"required",
			category: "required",
			
			

		},
		messages: {
			alias: "Please enter Alias Name",
			fieldName: "Please enter  Field Name",
			type: "Please enter Attribute Type",
			size: "Please enter Numeric Attribute Size",
			category_type_sel:"Please enter  Category Type",
			category: "Please enter  Category",
			
		}

	});

	if ($("#addAttributeformID").valid())
	{


		updateAttribute();

	}


}

function updateAttribute()
{



	jQuery.ajax({
		type:"POST",        
		url: "masterattrib/updateattribute" ,
		data: jQuery("#addAttributeformID").serialize(),
		success: function (data) 
		{

			if(data=='true')
			{
				//attrDialog.dialog( "destroy" );
				$("#attribute-dialog-form").remove();
				displayRefreshedMasterAttr();

				jAlert('Data Sucessfully Saved','Master Attribute');
			}

			else  if(data=='duplicate')
			{
				jAlert('Duplicate alias/fieldname', 'MasterAttribute');


			}
			else  if(data=='false')
			{
				jAlert('Error in saving data', 'MasterAttribute');	
				//attrDialog.dialog("destroy");


			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {

			alert('err.Message');
		}
	});





}

