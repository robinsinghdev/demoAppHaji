
$( document ).on( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
	 $.support.cors = true;
     $.mobile.allowCrossDomainPages = true;
     
     jQuery.mobile.phonegapNavigationEnabled = true;
     jQuery.mobile.defaultDialogTransition = "pop";
     jQuery.mobile.defaultPageTransition = "none";
      
     jQuery.mobile.loader.prototype.options.text = "loading";
     jQuery.mobile.loader.prototype.options.textVisible = true;
     jQuery.mobile.loader.prototype.options.theme = "a";
     
     $.mobile.toolbar.prototype.options.updatePagePadding = false;
     $.mobile.toolbar.prototype.options.hideDuringFocus = "";
     $.mobile.toolbar.prototype.options.tapToggle = false;
});


var ajaxCallGet = "GET";
var ajaxCallPost = "POST";
var ajaxCallUnset = "GET";
var dynPanelCount = 1,
dynPanelBtnCount = 1;
var noDataFoundMsg = "No data found.";
//$(document).one('pagebeforecreate', function () {});


$(document).on("pageinit", function () {
    if($(this).attr("href") == "#"+$.mobile.pageContainer.pagecontainer("getActivePage")[0].id) {
    	//alert($.mobile.pageContainer.pagecontainer("getActivePage")[0].id);
    }
});

//var appUrl='http://192.168.1.11:8080/Edit/appEntry.do';
//var appUrl='http://122.166.218.28:8080/Edit/appEntry.do';
var appUrl = '';
var appRequiresWiFi='This action requires internet.';
var serverBusyMsg='Server is busy, please try again later.';
var mData={};
var db;
var pushNotification;

var app = {
    SOME_CONSTANTS : false,  // some constant
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    // Bind Event Listeners Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    initFastClick : function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        }, false);
    },
    // Phonegap is now ready...
    onDeviceReady: function() {
        document.addEventListener("backbutton", onBackKeyDown, false);
        if(window.localStorage["gcmregistrationId"] === undefined ) {
			window.localStorage["gcmregistrationId"] = "";
		}
		pushNotification = window.plugins.pushNotification;
		try{
        	pushNotification = window.plugins.pushNotification;
        	pushNotification.register(successHandler, errorHandler, {"senderID":"329763220550","ecb":"onNotification"});		// required!
        }
		catch(err){
			var txt="There was an error on this page.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
			console.log(txt); 
		}
		
        if(window.localStorage["appUrl"] === undefined ) {
        	window.localStorage["appUrl"] = '';
        	window.localStorage["schoolCode"] = '';
        	$(".schoolCodeContainer").show();
			$(".loginFormContainer").hide();
        }else{
    		//db = window.sqlitePlugin.openDatabase({name: "stims.db", location: 2});
    		//db.transaction(initializeDB, errorCB, successCB);
        	appUrl=window.localStorage["appUrl"];
			
        	
        	//checkPreAuth();
        }	
		
        // $("#loginForm").on("submit",handleLogin);
    },
};

//handle GCM notifications for Android
function onNotification(e) {
    switch( e.event ){
        case 'registered':
			if ( e.regid.length > 0 ){
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				console.log("regID = " + e.regid);
				window.localStorage["gcmregistrationId"] = e.regid;
			}
        break;
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	if (e.foreground){
        		//console.log("INLINE NOTIFICATION");
			    // on Android soundname is outside the payload. 
			}
			else{	
				// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart){}
					//console.log("COLDSTART NOTIFICATION");
				else{}
					//console.log("BACKGROUND NOTIFICATION");
			}
        	var dataNotifyObj = '<li>'+
									'<div class="main-content">'+
										'<div class="feat_small_icon">'+
											'<i class="fa fa-bell-o"></i>'+
										'</div>'+
										'<div class="feat_small_details">'+
											'<h5> '+ e.payload.message +' </h5>'+
											'<a href="#" class="ui-link"> '+getTodayDate();+' </a>'+
										'</div>'+
									'</div>'+	
								'</li>';
			var $notificationUlObj = $("#notification-page").find("ul.features_list_detailed");
        	$notificationUlObj.append(dataNotifyObj);
        	
        	var currentNotificationCount = $(".notification-count-link span").html();
        	var currentNotificationCountNew = parseInt(currentNotificationCount) + 1;
        	$(".notification-count-link span").html(currentNotificationCountNew);
        	$(".notification-count-link").show();        	
			//console.log(e.payload.message+"---"+e.payload.msgcnt);
            //android only
        	break;
        
        case 'error':
			 console.log(e.msg);
			 break;
        
        default:
		 	console.log(" Unknown, an event was received and we do not know what it is");
        	break;
    }
}

function successHandler (result) {
    console.log(result);
}

function errorHandler (error) {
    console.log(error);
}

function showModal(){
  $('body').append("<div class='ui-loader-background'> </div>");
  $.mobile.loading( "show" );
}

function hideModal(){
	 $(".ui-loader-background").remove();
	 $.mobile.loading( "hide" );
}

function onBackKeyDown() {
	if($.mobile.activePage.is('#login-page')){
        showExitDialog();
    }
	else if($.mobile.activePage.is('#home-page')){
        /* 
        Event preventDefault/stopPropagation not required as adding backbutton
         listener itself override the default behaviour. Refer below PhoneGap link.
       */
       //e.preventDefault();
       showExitDialog();
   }
	else if($.mobile.activePage.is('#page-2')){
       $.mobile.changePage('#home-page','slide');
   }
	else{
		$.mobile.changePage('#home-page','slide');
		//window.history.back();
   }
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    return states[networkState];
}

function checkPreAuth() {
	var connectionType=checkConnection();
	if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
		var form = $("#loginForm");
		if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined && window.localStorage.getItem("user_logged_in")==1) {
			$("#username", form).val(window.localStorage["username"]);
			$("#password", form).val(window.localStorage["password"]);
			handleLogin();
		}
	}
	else{
		navigator.notification.alert(appRequiresWiFi, exitAppForcefully, 'EDIT','Ok');
	}
}

function logout() {
	window.localStorage["password"] = '';
	window.localStorage["user_logged_in"] = 0;
	window.localStorage["ID"] = '';
	window.localStorage["permissions"] = '';
	window.localStorage["email"] = '';
	var form = $("#loginForm");
	$("#username", form).val(window.localStorage["username"]);
	$("#password", form).val('');
	$(".schoolCodeContainer").hide();
	$(".loginFormContainer").show();
	$.mobile.changePage('#login-page','slide');
}

function gotoHome(){
	if(window.localStorage["userRoleId"] ==4 || window.localStorage["userRoleId"]==9){
		$("#staff_homepage").hide();
		$("#student_homepage").show();
	}else if(window.localStorage["userRoleId"]==2){ // Teacher Role
		$("#staff_homepage").show();
		$("#student_homepage").hide();
	}
	$.mobile.changePage('#home-page','slide');
}

function handleLogin() {
	var form = $("#loginForm");
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val(); 
	//u = 'ambika_jbr@g.com'; //staff
	//p='admin'; // parent
	
	if(u != '' && p!= '') {
		var connectionType=checkConnection();
		//var connectionType="WiFi connection";//For Testing
		
		var loginData={};
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			if(window.localStorage["user_logged_in"] ==1) {
				navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
				//checkingUserAssignedRoles();
				//$.mobile.changePage('#home-page',{ transition: "slideup"});
			}
			else{
				navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
			}	
		}
		else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
			showModal();
			loginData.username=u;
			loginData.password=p;
			loginData.gcmregdid = window.localStorage["gcmregistrationId"];
			//loginData.gcmregdid = "reg";//For Testing
			$.ajax({
				//type : 'POST',
				url:appUrl,
				data : {"action":"login","loginData":JSON.stringify(loginData), "mData":JSON.stringify(mData) },
				success:function(data){
					var responseJson=jQuery.parseJSON(data);
					var responseMessage=responseJson["msg"];
					if(responseJson.statusCode == "0" ){
						//var appUserData=responseJson.appUserData;
						window.localStorage["username"] = u;
						window.localStorage["password"] = p;
						window.localStorage["user_logged_in"] = 1;
											
						if (window.localStorage.getItem("permissions") === null ) {
							window.localStorage["permissions"] = '';
						}
						
						var loginDataResponse=responseJson["loginDataResponse"];
						window.localStorage["name"] = loginDataResponse["name"];
						window.localStorage["userRoleId"] = loginDataResponse["userRoleId"];
						window.localStorage["userRoleName"] = loginDataResponse["userRoleName"];
						
						//checkingUserAssignedRoles(); 
						$person_details_right_panel=$(".person_details_right_panel");
						$person_details_right_panel.find(".name").html(window.localStorage["name"]);
						$person_details_right_panel.find(".email").html(window.localStorage["username"]);
						
						var allData=responseJson["allData"];
						
						if(loginDataResponse["userRoleId"]==4 || loginDataResponse["userRoleId"]==9){ // 4= Parent Role, 9= Student Role
							
							$("#staff_homepage").hide();
							$("#student_homepage").show();
							
							// Student & Parent Related data
							var studData= allData["jsonObjStudData"];
							
							var studName=studData["name"];
							var studMobileNo=studData["mobileNumber"];
							
							
							
						}
						else if(loginDataResponse["userRoleId"]==2){ // Teacher Role
							window.localStorage["staffDetailsId"] = loginDataResponse["staffDetailsId"];
							$("#staff_homepage").show();
							$("#student_homepage").hide();
						}
						panelsInitialization(true, true, loginDataResponse["userRoleId"]);
						$.mobile.changePage('#home-page',{ transition: "slideup"});
					}else{
						window.localStorage["password"] = '';
						window.localStorage["user_logged_in"] = 0;
						window.localStorage["appUserData"] = '';
						
						window.localStorage["email"] = '';
						
						var form = $("#loginForm");
						$("#username", form).val(window.localStorage["username"]);
						$.mobile.changePage('#login-page','slide');
						
						navigator.notification.alert(responseMessage,		//'Invalid Credentials, please try again.',
						    alertConfirm, 'EDIT', 'Ok');
					}
				hideModal();
			   },
			   error:function(data,t,f){
				   hideModal();
				   navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
				   var responseJson = $.parseJSON(data);
				   if(responseJson.status==404){
					   navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
				   }
			   }
			});
		}
		else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
		$("#submitButton").removeAttr("disabled");
	}
	else{
		navigator.notification.alert('You must enter a username and password.', alertConfirm, 'EDIT', 'Ok');
		$("#submitButton").removeAttr("disabled");
	}
	return false;
}

function showExitDialog() {
    navigator.notification.confirm(
            ("Do you want to Exit?"), // message
            alertexit, // callback
            'EDIT', // title
            'YES,NO' // buttonName
    );
}

//Call exit function
function alertexit(button){
    if(button=="1" || button==1){
        //device.exitApp();
        navigator.app.exitApp();
    }
}

function doLogout() {
	var connectionType=checkConnection();
	//var connectionType="Unknown connection";//For Testing
	if(connectionType=="Unknown connection" || connectionType=="No network connection"){
		navigator.notification.alert('Logout requires active internet connection', alertConfirm, 'EDIT', 'Ok');
	}
	else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
		showLogoutDialog();
	}
}

function alertConfirm(buttonIndex){
	// function for alert having no actions
}

function exitAppForcefully(buttonIndex){
	//Call exit function
    if(button=="1" || button==1){
        navigator.app.exitApp();
    }
}

function showLogoutDialog() {
    navigator.notification.confirm(
            ("Are you sure to Logout?"), // message
            alertlogout, // callback
            'EDIT', // title
            'YES,NO' // buttonName
    );
}

//Call logout function
function alertlogout(button){
    if(button=="1" || button==1){
    	logout();
    }
}

function getRandomNumber(){
	var minimumNum=1;
	var maximumNum=74;
	var randomNum = Math.floor(Math.random() * (maximumNum - minimumNum + 1)) + minimumNum;
	return (randomNum-1);
}

function refreshSelect(ele,currentValue){
	// Grabbing a select field
	var el = $(ele);
	// Select the relevant option, de-select any others
	el.val(currentValue).attr('selected', true).siblings('option').removeAttr('selected');
	// Initialize the selectmenu
	el.selectmenu();
	// jQM refresh
	el.selectmenu("refresh", true);
}

/** 
 * Convert seconds to hh-mm-ss format.
 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
**/
function secondsTohhmm(totalSeconds) {
  var hours   = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  //var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  // round seconds
  //seconds = Math.round(seconds * 100) / 100

  var result = (hours < 10 ? "0" + hours : hours);
      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
      //result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
  return result;
}

function getTodayDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;//January is 0, so always add + 1

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd}
	if(mm<10){mm='0'+mm}
	//var todayString = yyyy+'-'+mm+'-'+dd;
	var todayString = dd + '/' +mm + '/' + yyyy;
	return todayString;
}

function currentDateTime() {
	var currentdate = new Date();
	var formattedSeconds=currentdate.getSeconds();
	if(formattedSeconds < 10){
		formattedSeconds = "0"+formattedSeconds;
	}
    var datetimeValue = formatdateTimeStr(currentdate.getFullYear()) + "-"
    				+formatdateTimeStr(currentdate.getMonth()+1)  +"-"
				    +formatdateTimeStr(currentdate.getDate()) 
	                +"T" 
	                + formatdateTimeStr(currentdate.getHours()) + ":"  
	                + formatdateTimeStr(currentdate.getMinutes()) + ":" 
	                + formatdateTimeStr(currentdate.getSeconds());
	return datetimeValue;
}

function formatdateTimeStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

function calculateDateTimeDiff(old_date,new_date) {
	// The number of milliseconds in one second
     var ONE_SECOND = 1000;
     // Convert both dates to milliseconds
     var old_date_obj = new Date(old_date).getTime();
     var new_date_obj = new Date(new_date).getTime();
     // Calculate the difference in milliseconds
     var difference_ms = Math.abs(new_date_obj - old_date_obj)
     // Convert back to totalSeconds
     var totalSeconds = Math.round(difference_ms / ONE_SECOND);
     //alert('total seconds--' +totalSeconds);
     return totalSeconds;
}

//function checkingUserAssignedRoles(){}

/* ************* Database Code Starts   -------------------------  */
// Open Database
function openDatabase() {
   db.transaction(initializeDB, errorCB, successCB);
}
//Close Database
function closeDatabase() {
}
//Populate the database 
function initializeDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS datas (id integer primary key autoincrement,pid integer,stud_manager text )');
}
//Transaction success callback
function successCB() {
	//alert('db transcation success');
}
//Transaction error callback
function errorCB(err) {
	//alert("Error processing SQL: "+err.code);
	//console.log("Error processing SQL: "+err.code);
}
/* ************* Database Code Ends   -------------------------  */

/*  ------------------- Function/Module Wise Code(For Parents/Student) Starts -------------------------  */

	function getDataByAction(actionName, mDataJsonString, successCallbackFn, errorCallbackFn) {
		var connectionType=checkConnection();
		//var connectionType="WiFi connection";//For Testing
		
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
		else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
			showModal();
			var loginData={};
			loginData.username=window.localStorage["username"];
			loginData.password=window.localStorage["password"];
			loginData.gcmregdid = window.localStorage["gcmregistrationId"];
			//loginData.gcmregdid = "reg";//For Testing
			
			$.ajax({
				//type : 'POST',
				url:appUrl,
				data : {"action":actionName, "loginData":JSON.stringify(loginData), "mData":mDataJsonString },
				success: successCallbackFn,
			    error: errorCallbackFn
			});
		}
		else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
	}
	
	function getDataByUrlAndData(url, data, successCallbackFn, errorCallbackFn, ajaxCallType) {
		var connectionType=checkConnection();
		//var connectionType="WiFi connection";//For Testing
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
		else if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
			showModal();
			var loginData={};
			loginData.username=window.localStorage["username"];
			loginData.password=window.localStorage["password"];
			loginData.gcmregdid = window.localStorage["gcmregistrationId"];
			//loginData.gcmregdid = "reg";//For Testing
			
			$.ajax({
				type : ajaxCallType,
				url: url,
				data : data,
				success: successCallbackFn,
			    error: errorCallbackFn
			});
		}
		else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
	}
	
	function commonSuccessCallback(data) {
		hideModal();
		var res=jQuery.parseJSON(data);
		responseData=JSON.stringify(res);
		console.log(responseData);
	}
	
	function commonErrorCallback(data) {
	    hideModal();
		navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		var responseJson = $.parseJSON(data);
		if(responseJson.status==404){
		     navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');
		}
	}
	
	var tableDivObj='<div class="table-div">'+
					    '<div class="date-time-details">'+
						'<span class="">replaceDate</span>'+
					    '<span class="pull-right">replaceTime</span>'+
					'</div>'+
					'<div class="general-details">'+
					     '<div class="ui-grid-a my-breakpoint">'+
					         '<div class="ui-block-a">'+
					            '<div class="name">replaceName</div>'+
					         '</div>'+
					        '<div class="ui-block-b text-align-right">'+
					           '<span class="link-custom-spam">'+
					             //'<a href="#">View</a>'+
					           '</span>'+
					        '</div>'+
					     '</div>'+
					     '<div class="more-details-main ">'+
					          '<div class="text-align-right">'+
					              '<a class="link" href="#" onclick="moreDetails(this);">Show Details</a>'+
					          '</div>'+
					          '<div style="display: none;" class="more-details moreDetailsDiv12">'+
					                 '<p class="other-details"><span>replaceOtherDetails</span></p>'+
					           '</div>'+
					      '</div>'+
					  '</div>'+
					'</div>';
	
	var tableDivObjEmpty='<div class="table-div">'+
						    '<div class="date-time-details"></div>'+
						    	'<div class="general-details">'+
							     '<div class="ui-grid-a my-breakpoint">'+
							         '<div class="ui-block-a">'+
							            '<div class="name">replaceName</div>'+
							         '</div>'+
							        '<div class="ui-block-b text-align-right">'+
							           '<span class="link-custom-spam">'+
							           '</span>'+
							        '</div>'+
							     '</div>'+
						  '</div>'+
						'</div>';
	
	function commonPageSuccessCallback(data){
		var responseJson=jQuery.parseJSON(data);
		if(responseJson.statusCode == "0" ){
			//var $parentEleObj=$('.common-page-tab1 .table-main-div');
			var $parentEleObj = $('.common-page-tab1 .mb-st-assignment-list ul.st-assigment');
			$parentEleObj.html("");
			$('.common-page-tab1 .mb-st-assignment-list').show();
			var actionHeading=responseJson["actionHeading"];
			$('.common-page-tab1 .common-page-tab-heading').html(actionHeading);
			var action=responseJson["action"];
			var jsonData=responseJson["data"];
			
			if(action=="getAssignments"){
				commonPageAssignmentData($parentEleObj, jsonData);
			}
			else if(action=="getStaffAttendanceForStaff"){
				commonPageStaffAttendanceForStaffData($parentEleObj, jsonData);
			}
			$.mobile.changePage('#common-page','slide');
		}else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');					
		}
		hideModal();
	}
	
	function commonPageLiNoDataMsg($parentEleObj, msg){
		var statusClass = "status-common";
		var dataEleObj = '<li>'+
							'<i class="fa fa-dot-circle-o status-circle '+statusClass+' "></i>'+
							'<div class="st-assign-detail">'+
								'<span class="assign-arrow"></span>'+
									'<p class="assign-title"> ' + msg +
									'</p>'+
							'</div>'+
						'</li>';
		$parentEleObj.append(dataEleObj);
	}
	
	function getNewsEventAndCommListForParent(){
		mData={};
		mData.p1=window.localStorage["studDetailsId"];
		mData.p2=window.localStorage["studStandardDivisionId"];
		getDataByAction("getNewsEventAndCommListForParent", JSON.stringify(mData), getNewsEventAndCommListForParentSuccessCB, commonErrorCallback);
	}
	
	function getNewsEventAndCommListForParentSuccessCB(data){
		var responseJson=jQuery.parseJSON(data);
		if(responseJson.statusCode == "0" ){
			var $parentEleObj=$('#allChatsDiv ul.all-chats-ul');
			$parentEleObj.html("");
			//var actionHeading=responseJson["actionHeading"];
			//$('.common-user-list-details .page-tab-heading').html(actionHeading);
			var action=responseJson["action"];
			var jsonData=responseJson["data"];
			if(jsonData.length > 0){
				jQuery.each(jsonData, function(index, item) {
					var onclickFn = "alertCustomMsg('No reply option availabe for this event.');return false;";
					if(item["participation_required"]){
						onclickFn = "loadChat(this);return false;";
					}
					var dataEleObj = '<li onclick=" '+onclickFn+' " data-id="'+ item["id"] +'" data-name="'+ item["name"] +'" data-participationFlag="'+ item["participation_required"] +'" '+
											' >'+
										'<div class="main-content">'+
											'<div class="feat_small_icon">'+
												'<i class="fa fa-calendar"></i>'+
											'</div>'+
											'<div class="feat_small_details">'+
												'<h5> '+ item["name"] +' </h5>'+
												'<a href="#" class="ui-link"> '+ item["message"] + '</a>'+
											'</div>'+
										'</div>'+	
										'<div class="time_detail">'+
											'<span class="time_sub">'+
												' Contact Person: '+ item["contact_person_name"] +'</span>'+
										'</div>'+
										'<div class="time_detail">'+
											'<span class="time_sub">'+
												'Start Date: '+ item["start_date"] +' '+ item["start_time"] +' </span>'+
											'<span class="sub_person"> </span>'+
										'</div>'+
										'<div class="time_detail">'+
											'<span class="time_sub">'+
												'End Date: '+ item["end_date"] +' '+ item["end_time"] +' </span>'+
										'</div>'+
										'<div class="time_detail">'+
											'<span class="time_sub">'+
												'Evevt Type: '+ item["evevt_type"] +' </span>'+
										'</div>'+
										
									'</li>';
					$parentEleObj.append(dataEleObj);
				});
			}else{
				var dataEleObj="<li>No Data</li>";
				$parentEleObj.append(dataEleObj);
			}
		}
		else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,'EDIT','Ok');					
		}
		hideModal();
	}
	
/*  ------------------- Function/Module Wise Code(For Parents/Student) Ends -------------------------  */
	function moreDetails(currObj){
		var $parentDiv = $(currObj).parents(".more-details-main");
		var $moreDetails = $parentDiv.find('.more-details');
		
		if($moreDetails.is(':visible')){
			$(currObj).text('Show Details');
			$moreDetails.hide();
		}else{
	        $(currObj).text('Hide Details');
	        $moreDetails.show();
		}
	}
	
	function getSchoolInfo(){
		var form = $("#schoolCodeForm");
		$("#getSchoolInfoSubmitBtn", form).attr("disabled","disabled");
		var schoolCode = $("#schoolCode", form).val();
		//schoolCode ='editlocal'; //schoolCode
		//schoolCode ='kcs003'; //schoolCode
		
		if(schoolCode != '') {
			var mData={};
			showModal();
			mData.schoolCode = schoolCode;
			var schoolInfoAppUrl ='http://editapi.edit-ims.com/editimsapi.php';
			var dataToSend = {};
			dataToSend["action"] = "instcode";
			dataToSend["instcode"] = schoolCode;
			window.localStorage["schoolCode"] = schoolCode;
			dataToSend["mData"] = JSON.stringify(mData);
			//{"action":"instcode","instcode": schoolCode, "mData":JSON.stringify(mData) },
			getDataByUrlAndData(schoolInfoAppUrl, dataToSend, schoolInfoSuccessCB, schoolInfoErrorCB, ajaxCallPost);
			
			$("#getSchoolInfoSubmitBtn").removeAttr("disabled");
		}
		else{
			navigator.notification.alert('You must enter school code.',	alertConfirm,'EDIT','Ok');
			$("#getSchoolInfoSubmitBtn").removeAttr("disabled");
		}
		return false;
	}
	
	function schoolInfoSuccessCB(data){
		var responseJson = jQuery.parseJSON(data);
		var jsonArrInstitutes = responseJson["jsonArrInstitutes"];
		var status = jsonArrInstitutes["status"];
		if(status == 1){
			var server_appentry = jsonArrInstitutes["server_appentry"];
			console.log(server_appentry);
			appUrl=server_appentry;
			window.localStorage["appUrl"]=server_appentry;
			$(".schoolCodeContainer").hide();
			$(".loginFormContainer").show();
			$(".schoolCodeLabel").html(window.localStorage["schoolCode"]);
		}else if(status == 0){
			navigator.notification.alert('Please input correct institute code', alertConfirm, 'EDIT','Ok');
		}
		hideModal();
	}
	
	function schoolInfoErrorCB(data){
		 hideModal();
		 navigator.notification.alert("Connection Problem" ,alertConfirm,'EDIT','Ok');
		 var responseJson = $.parseJSON(data);
		 if(responseJson.status==404){
		   navigator.notification.alert("Connection Problem" ,alertConfirm,'EDIT','Ok');
		 }
	}
	
	function alertCustomMsg(msg){
		navigator.notification.alert(msg, alertConfirm, 'EDIT', 'Ok');	
	}
	