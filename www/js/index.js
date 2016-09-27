
var appName="Ibrahim A. Pinto";
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

var leftPanelObj= 		
						'<div class="nd2-sidepanel-profile fadeInDown" >'+
							'<img class="profile-background" src="http//lorempixel.com/400/200/abstract/2/" />'+
							'<div class="row">'+
								'<div class="col-xs-12">'+
									'<div class="box profile-text">'+
										'<strong>'+ appName +'</strong>'+
										'<span class="subline">Hajj & Umrah Services</span>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						

						'<ul data-role="listview" data-inset="false" >'+
							'<li data-role="list-divider">Menu</li>'+
						'</ul>'+
						
						'<div data-inset="false" >'+
							'<ul data-role="listview" data-inset="false" data-icon="false" >'+
								'<li><a href="#home-page" data-ajax="false" data-icon="false">Home</a></li>'+
								'<li><a href="#packages-page" data-ajax="false" data-icon="false">Packages</a></li>'+
								'<li><a href="#" data-ajax="false" data-icon="false">Booking Status</a></li>'+
								'<li><a href="#" data-ajax="false" data-icon="false">Sayings & Quotes</a></li>'+
								'<li><a href="#" data-ajax="false" data-icon="false">About Us</a></li>'+
							'</ul>'+
						'</div>'+
						
						'<hr class="inset">'+
						
						'<ul data-role="listview" data-inset="false">'+
							'<li data-role="list-divider">Information</li>'+
						'</ul>'+
						
						'<div>'+
							'<ul data-role="listview" data-inset="false" data-icon="false" >'+
								'<li><a href="#" data-ajax="false" data-icon="false">v1.0.3</a></li>'+
							'</ul>'+
						'</div>';

var connectionType;						
var ajaxCallGet = "GET";
var ajaxCallPost = "POST";
var ajaxCallUnset = "GET";
var dynPanelCount = 1,
dynPanelBtnCount = 1;
var noDataFoundMsg = "No data found.";
var currentPageTemp;

function panelsInitialization(initLeftPanelFlag, initRightPanelFlag, roleId){
	dynPanelCount = 1;
	dynPanelBtnCount = 1;
    
	$.mobile.pageContainer.find("[data-role=page]").each(function () {
		var currPanelObj = $(this).find(".st-leftPanel");
		var panelFoundFlag = currPanelObj.length;
		console.log(panelFoundFlag);
		console.log(panelFoundFlag);
			
			if(panelFoundFlag == 0){
				var leftPanelDynObj="";
		        leftPanelDynObj += '<div id="leftPanel' + dynPanelCount + '" class="panel left st-leftPanel" data-role="panel" data-position="left" data-position-fixed="true" data-display="overlay" >';
		        
		        	leftPanelDynObj += leftPanelObj;
		        	leftPanelDynObj += '</div>';
		        
		        $(this).prepend(leftPanelDynObj);
			}
			else{
				console.log("panel--"+$(this).attr("id")+"---"+currPanelObj.find(".ui-panel-inner").length);
				
				currPanelObj.find("#menu-wrapper .menu").html(leftPanelObj);
				if(currPanelObj.find(".ui-panel-inner").length == 0){
					currPanelObj.find(".ui-panel-inner ul.menu").html(leftPanelObj);
				}
			}
	        dynPanelCount++;
	        
	        var btnFoundFlag = $(this).find("[data-role=header] .st-leftPanel-btn").length;
			
	        if(btnFoundFlag == 0){
	        	var leftPanelDynBtn='<a class="ui-btn-left fadeIn waves-effect waves-button ui-btn ui-btn-active" href="#leftpanel' + (dynPanelBtnCount) + '" data-role="button" role="button"><i class="zmdi zmdi-menu"></i></a>';	
	    		var rightPanelDynBtn='<a class="ui-btn-right fadeIn waves-effect waves-button ui-btn" href="#login-page" data-role="button" role="button"><i class="zmdi zmdi-sign-in zmd-fw"></i></a>';
				
	    		$(this).find("[data-role=header]").append(leftPanelDynBtn);
	    		$(this).find("[data-role=header]").append(rightPanelDynBtn);
	        }
			dynPanelBtnCount++;	
    }); 
}

//$(document).one('pagebeforecreate', function () {});

$(document).on("pagebeforeshow", function () {
	//panelsInitialization(true, true, 0);
});	

$(document).on("pagechange", function (e, data) {
	
  var currPage = data.toPage[0].id;
  currentPageTemp=currPage;
  if(currPage == 'home-page'){
	getAvailablePackageList();
  }
  else if(currPage == 'login-page'){
  }
  else if(currPage == 'packages-page'){
	getAvailablePackageList();
  }
  else if(currPage == 'cat-wise-data-page'){
	getActiveInfoData();
  }
  
});

$(document).on("pageinit", function () {
	// if($(this).attr("href") == "#"+$.mobile.pageContainer.pagecontainer("getActivePage")[0].id) {
    	//alert($.mobile.pageContainer.pagecontainer("getActivePage")[0].id);
    // }
});

var appUrl = 'http://ibrahimpinto.stavyah.com/app/mobile/';
window.localStorage["appUrl"] = appUrl;
window.localStorage["s_key"] = 'anBPRUhxbnpHZjJiOXRHZ1JNNWhqdz09';
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
		
		window.localStorage["isgcmregistered"] = 0;
		window.localStorage["gcmregistrationId"]="";
        if(window.localStorage["gcmregistrationId"] === undefined ) {
			window.localStorage["gcmregistrationId"] = "";
		}
		pushNotification = window.plugins.pushNotification;
		try{
        	pushNotification = window.plugins.pushNotification;
        	pushNotification.register(successHandler, errorHandler, {"senderID":"329763220550","ecb":"onNotification"});//required!			
        }
		catch(err){
			var txt="There was an error on this page.\n\n";
			txt+="Error description: " + err.message + "\n\n"; 
			console.log(txt); 
		}
        
		//db = window.sqlitePlugin.openDatabase({name: "stims.db", location: 2});
		//db.transaction(initializeDB, errorCB, successCB);
		
		//checkPreAuth();
        // $("#loginForm").on("submit",showMyBookingInfo);
		downloadFileByUrlCheck("http://www.stavyah.com/images/stavyah-logo.png", "user_data", "myimage1");
		downloadFileByUrlCheck("http://119.81.82.114:8080/EditDemo/AdminLTE-master/img/avatar5.png", "user_data", "myimage2");
    },
};

//handle GCM notifications for Android
function onNotification(e) {
    switch( e.event ){
        case 'registered':
			if ( e.regid.length > 0 ){
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				//console.log("regID = " + e.regid);
				window.localStorage["gcmregistrationId"] = e.regid;
				
				// $(".tempGCMId").html( window.localStorage["gcmregistrationId"] ); //For testing				
				if(window.localStorage["gcmregistrationId"] != "" && window.localStorage["isgcmregistered"]==0){
					registerAppId();
				}
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
				else{
				}
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
								
			var $notificationUlObj = $("#notification-page").find("ul.st_notification_list");
        	$notificationUlObj.append(dataNotifyObj);
        	
			$.mobile.changePage('#notification-page','slide');
			/*
        	var currentNotificationCount = $(".notification-count-link span").html();
        	var currentNotificationCountNew = parseInt(currentNotificationCount) + 1;
        	$(".notification-count-link span").html(currentNotificationCountNew);
        	$(".notification-count-link").show();  
			*/
			
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
	connectionType="WiFi connection";//For Testing
	return connectionType;//For Testing

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
	connectionType=checkConnection();
	if(connectionType=="WiFi connection" || connectionType=="Cell 4G connection" || connectionType=="Cell 3G connection" || connectionType=="Cell 2G connection"){
		var form = $("#loginForm");
		if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined && window.localStorage.getItem("user_logged_in")==1) {
			$("#username", form).val(window.localStorage["username"]);
			$("#password", form).val(window.localStorage["password"]);
			handleLogin();
		}
	}
	else{
		navigator.notification.alert(appRequiresWiFi, exitAppForcefully, appName ,'Ok');
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
		connectionType=checkConnection();
		
		var loginData={};
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			if(window.localStorage["user_logged_in"] ==1) {
				navigator.notification.alert(appRequiresWiFi,alertConfirm, appName,'Ok');
				//checkingUserAssignedRoles();
				//$.mobile.changePage('#home-page',{ transition: "slideup"});
			}
			else{
				navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
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
						panelsInitialization(true, true, 0);
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
						    alertConfirm, appName, 'Ok');
					}
				hideModal();
			   },
			   error:function(data,t,f){
				   hideModal();
				   navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
				   var responseJson = $.parseJSON(data);
				   if(responseJson.status==404){
					   navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
				   }
			   }
			});
		}
		else{
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
		}
		$("#submitButton").removeAttr("disabled");
	}
	else{
		navigator.notification.alert('You must enter credentials.', alertConfirm, appName, 'Ok');
		$("#submitButton").removeAttr("disabled");
	}
	return false;
}

function showExitDialog() {
    navigator.notification.confirm(
            ("Do you want to Exit?"), // message
            alertexit, // callback
            appName, // title
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
	connectionType=checkConnection();
	if(connectionType=="Unknown connection" || connectionType=="No network connection"){
		navigator.notification.alert('Logout requires active internet connection', alertConfirm, appName, 'Ok');
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
            appName, // title
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
		connectionType=checkConnection();
		
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
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
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
		}
	}
	
	function getDataByUrlAndData(url, data, successCallbackFn, errorCallbackFn, ajaxCallType) {
		connectionType=checkConnection();
		if(connectionType=="Unknown connection" || connectionType=="No network connection"){
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
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
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
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
		navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
		var responseJson = $.parseJSON(data);
		if(responseJson.status==404){
		     navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');
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
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');					
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
			navigator.notification.alert(appRequiresWiFi,alertConfirm,appName,'Ok');					
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
	
	
	
	function getAvailablePackageList(){
		var mData={};
		mData["action"] = 'getAvailablePackageList';
		mData["s_key"] = window.localStorage["s_key"];
		getDataByUrlAndData(appUrl, mData, getAvailablePackageListSuccessCB, commonAppErrorCB, ajaxCallGet);
		return false;
	}
	
	function getAvailablePackageListSuccessCB(data){
		var responseJson = jQuery.parseJSON(data);
		var ajaxStatus = responseJson["status"];
		
		if(ajaxStatus == 'success'){
			var image_path=responseJson["image_path"];
			
			var resultArr = responseJson["result"];
			if(resultArr.length > 0){
				
				$("#"+ currentPageTemp + " ul.packages-list").empty();
				jQuery.each(resultArr, function(index, item) {
					var currImg = image_path + item["mobile_image"];
					
					var tp_id = item["tp_id"];
					var name = item["name"];
					var from_date = item["from_date"];
					var to_date = item["to_date"];
					var booking_open_from = item["booking_open_from"];
					var booking_open_till = item["booking_open_till"];
					var starting_destination = item["starting_destination"];
					var destination = item["destination"];
					var price_inr = item["price_inr"];					
					var description = item["description"];
					var package_status = item["package_status"];
					var is_deleted = item["is_deleted"];
					
					// &#8377; rupee
					// &#164; generic
					var dataEleObj= '<li class="" data-tpid="' + tp_id + '" onclick="getAvailablePackageById(this);">'
											+ '<a href="#" class="ui-btn waves-effect waves-button waves-effect waves-button">'
												+ ' <h2>' + name + '</h2> '
												+ ' <p><span class="icon-span"><i class="zmdi zmdi-calendar-note zmd-fw"></i></span>' + from_date + ' to ' + to_date + ' </p> '
												+ ' <p><span class="icon-span"><i class="zmdi zmdi-airplanemode-active zmd-fw"></i></span>' + starting_destination + ' to ' + destination + '</p> '
												+ ' <p><span class="icon-span"><i class="zmdi zmd-fw">&#8377;</i></span>' + price_inr + ' INR </p> '
												+ ' <p><span class="icon-span"><i class="zmdi zmdi-info-outline zmd-fw"></i></span><strong>Know More..</p> '
											+ '</a> '
										+ '</li>';
					$("#"+ currentPageTemp + " ul.packages-list").append(dataEleObj);				
				});
			}
			else{
				var dataEleObj= '<li class="ui-li-divider ui-bar-inherit" data-role="list-divider" role="heading"> ' + 
									' No data found.</li>';
					$("#"+ currentPageTemp + "ul.packages-list").append(dataEleObj);
			}
		}
		else {
			navigator.notification.alert('Data retrieval fail.', alertConfirm, appName,'Ok');
		}
		hideModal();
	}
	
	function getAvailablePackageById(thiss){
		var tpid = $(thiss).data("tpid");
		var mData={};
		mData["action"] = 'getAvailablePackageById';
		mData["s_key"] = window.localStorage["s_key"];
		mData["id"] = tpid;
		getDataByUrlAndData(appUrl, mData, getAvailablePackageByIdSuccessCB, commonAppErrorCB, ajaxCallGet);
		return false;
	}
	
	function getAvailablePackageByIdSuccessCB(data){
		var responseJson = jQuery.parseJSON(data);
		var ajaxStatus = responseJson["status"];
		
		if(ajaxStatus == 'success'){
			$.mobile.changePage('#packages-details-page','slide');
			 
			var image_path=responseJson["image_path"];
			
			$("ul.packages-details-list").empty();
			
			var resultObj = responseJson["result"];
			var item=resultObj;
			
			
			
			var currImg = image_path + item["mobile_image"];
			var tp_id = item["tp_id"];
			var name = item["name"];
			var from_date = item["from_date"];
			var to_date = item["to_date"];
			var booking_open_from = item["booking_open_from"];
			var booking_open_till = item["booking_open_till"];
			var starting_destination = item["starting_destination"];
			var destination = item["destination"];
			var price_inr = item["price_inr"];					
			var description = item["description"];
			var package_status = item["package_status"];
			var is_deleted = item["is_deleted"];
			var tourBreaksArr = item["breaks"];
			var branchesArr = item["branches"];			
				
			// var getAvailablePackageByIdFn = 'getAvailablePackageById('+tp_id+');';
			var dataEleObj= '<li class="" data-tpid="' + tp_id + '" tpid="' + tp_id + '" >'
									+ '<a href="#" class="ui-btn waves-effect waves-button waves-effect waves-button">'
										+ ' <h2>' + name + '</h2> '
										+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-calendar-note zmd-fw"></i></span>' + '<span class="icon-span-data">'+from_date + ' to ' + to_date + ' </span></p> '
										+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-airplanemode-active zmd-fw"></i></span>' + '<span class="icon-span-data">'+ starting_destination + ' to ' + destination + '</span></p> '
										+ ' <p><span class="icon-span medium"><i class="zmdi zmd-fw">&#8377;</i></span>' + '<span class="icon-span-data">'+ price_inr + ' INR </span></p> '
										
										+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-info-outline zmd-fw"></i></span> ' + '<span class="icon-span-data">'+ description + ' </span> </p> '
										
										if(tourBreaksArr.length > 0){
											+ ' <p><span class="icon-span"><i class="zmdi zmdi-pin-drop zmd-fw"></i></span><span class="icon-span-data"> Total Tour Breaks:<strong>' + tourBreaksArr.length + ' </strong> </span></p> ';
										}											
									+ '</a> '							
								+ '</li>';
			
			if(dataTypeCheckJSON(branchesArr)=='Array' && branchesArr.length > 0){
					dataEleObj+= '<li class="" data-tpid="' + tp_id + '" tpid="' + tp_id + '" >'
										+ '<a href="#" class="ui-btn waves-effect waves-button waves-effect waves-button">'
											+ ' <h2>Our Branches</h2> ';
											
						jQuery.each(branchesArr, function(branchesIndex, branchesItem) {
								
							dataEleObj+= '<p>'
											+ '<span class="icon-span medium"><i class="zmdi zmdi-collection-item-'+(branchesIndex+1)+'  zmdi-hc-fw"></i></span>' 
											+ '<span class="icon-span-data">'+ branchesItem["branch_name"] + ' </span>'
										+ '</p> '
										+ '<p>'
											+ '<span class="icon-span medium"><i class="zmdi zmdi-markunread-mailbox zmd-fw"></i></span>' 
											+ '<span class="icon-span-data">'
												+ branchesItem["address_1"] + ', ' 
												+ branchesItem["address_2"] + ', ' 
												+ branchesItem["district"] +  ', ' 
												+ branchesItem["city"] +  ', ' 
												+ branchesItem["pincode"] 
											+ '</span>'
										+ '</p>'
										+ '<hr>';
						});			
										
					dataEleObj += '</a></li>';		
				}	
				
				$("ul.packages-details-list").append(dataEleObj);
				
				$("ul.packages-tour-details").empty();

				var tourDataEleObj= '<li class="">'+
									  '<div class="heading">'+
										'<i class="zmdi zmdi-pin zmdi-hc-fw i-white"></i>Start Point: <strong>'+ starting_destination +'</strong> '+
									  '</div>'+
									'</li>';										
										
				if(tourBreaksArr.length > 0){
					// no-arrow
					jQuery.each(tourBreaksArr, function(index, item) {
						var tourHotelsArr= item["hotels"];	
						var arrowClass="";
						
						if(dataTypeCheckJSON(tourHotelsArr)=='Array' && tourHotelsArr.length > 0){
							arrowClass="plain";
						}
					
						tourDataEleObj+='<li class="no-arrow">'+
										  '<div class="heading">'+
											'<i class="zmdi zmdi-pin-drop zmdi-hc-fw i-white"></i>Break Point'+(index+1)+': <strong>'+ item["destination_name"] +'</strong> '+
										  '</div>'+
										  
										  '<div class=" '+arrowClass+' st-dashed-border-bottom">'+
											'<i class="zmdi zmdi-assignment zmdi-hc-fw i-white"></i>Break Details '+
											'<p><i class="zmdi zmdi-alarm-check zmdi-hc-fw i-white"></i> Arrival: '+ item["reaching_time"] + '</p>'+
											'<p><i class="zmdi zmdi-alarm-check zmdi-hc-fw i-white"></i> Departure: '+ item["restart_time"] + '</p>'+
											'<p><i class="zmdi zmdi-navigation zmdi-hc-fw i-white"></i> Next Destination: '+ item["destination_name"] + '</p>'+
										  '</div>';
							
						if(dataTypeCheckJSON(tourHotelsArr)=='Array' && tourHotelsArr.length > 0){	
							tourDataEleObj+='<div class="st-dashed-border-bottom">'+
													'<i class="zmdi zmdi-hotel zmdi-hc-fw i-white"></i>Hotel Details ' +
													'<p><i class="zmdi zmdi-info-outline zmdi-hc-fw i-white"></i> No. of hotels: '+ tourHotelsArr.length + '</p>'+
											'</div>';	
							
							jQuery.each(tourHotelsArr, function(hotelindex, hotelitem) {	
								/*
								
								tourDataEleObj+= '<div class="plain st-dashed-border-bottom">'+
													'<i class="zmdi zmdi-hotel zmdi-hc-fw i-white"></i>Hotel Details '+ hotelindex ;
													
													
													tourDataEleObj+= '<p><i class="zmdi zmdi-alarm-check zmdi-hc-fw i-white"></i> Rating: '+ item["star_rating"] + 'Stars</p>';
													
													if(item["address"] != ""){
														tourDataEleObj+= '<p><i class="zmdi zmdi-alarm-check zmdi-hc-fw i-white"></i> Address: '+ item["address"] + '</p>' ;
													}
													
													tourDataEleObj+= '<p><i class="zmdi zmdi-alarm-check zmdi-hc-fw i-white"></i> Contact: '+ item["phone_number1"] + ', '+ item["phone_number2"] + '</p>'+
													'<p><i class="zmdi zmdi-navigation zmdi-hc-fw i-white"></i> Email: '+ item["email"] + '</p>' ;													
												
													if(item["address"] != ""){
														tourDataEleObj+= '<p><i class="zmdi zmdi-navigation zmdi-hc-fw i-white"></i> Website: '+ item["website"] + '</p>' ;
													}
													
								tourDataEleObj+= '</div>';
								
								*/
							});
							
						}	
						tourDataEleObj+='</li>';		
										
					});
				}
				
				tourDataEleObj+='<li class="">'+
									'<div class="heading">'+
										'<time><i class="zmdi zmdi-pin zmdi-hc-fw i-white"></i>Destination: '+ destination +'</time> '+
									'</div>'+
								'</li>';
					
				$("ul.packages-tour-details").append(tourDataEleObj);
				
		}
		else {
			navigator.notification.alert('Data retrieval fail.', alertConfirm, appName,'Ok');
		}
		hideModal();
	}
	
	function getActiveInfoData(){
		var mData={};
		mData["action"] = 'getActiveInfoData';
		mData["s_key"] = window.localStorage["s_key"];
		getDataByUrlAndData(appUrl, mData, getActiveInfoDataSuccessCB, commonAppErrorCB, ajaxCallGet);
		return false;
	}
		
	function getActiveInfoDataSuccessCB(data){
		var responseJson = jQuery.parseJSON(data);
		var ajaxStatus = responseJson["status"];
		
		if(ajaxStatus == 'success'){
			
			var image_path=responseJson["image_path"];
			var constantsData=responseJson["constants"];
			
			// var constantsDataStatus=constantsData["status"];
			// var constantsDataStatusArr = getObjDataInArray(constantsDataStatus);
			// iterateAndAppendData(constantsDataStatusArr, $("ul.sdf"));
			
			var constantsDataCategory=constantsData["category"];
			var constantsDataCategoryArr = getObjDataInArray(constantsDataCategory);
			// iterateAndAppendData(constantsDataCategoryArr, $("ul.sdf"));
			
			jQuery.each(constantsDataCategoryArr, function(index, item) {
				//console.log(item["key"] +  );
				var catDividerObj= '<li class="ui-li-divider ui-bar-inherit" data-role="list-divider" role="heading"  data-catid="' + item["key"] + '"> ' + item["value"] + ' </li>';
				$("ul.home-page-cat-wise-list").append(catDividerObj);
			});
			
			var resultArr = responseJson["result"];
			if(resultArr.length > 0){
				
				$("ul.home-page-cat-wise-list").empty();
				jQuery.each(resultArr, function(index, item) {
					var topic_name = item["topic_name"];
					var general_info = item["general_info"];
					var category = item["category"];
					var currImg = image_path + item["mobile_image"];
					
					var catWiseDataObj= '<li class="ui-li-has-thumb">'
											+ '<a href="#" class="ui-btn waves-effect waves-button waves-effect waves-button">'
											+ '<img class="ui-thumbnail ui-thumbnail-circular" src="http://lorempixel.com/150/150/people/1/" class="ui-thumbnail ui-thumbnail-circular" /> '
												+ ' <h2>' + item["topic_name"] + '</h2> '
												+ ' <p>' + item["general_info"] + '</p> '
											+ '</a> '
										+ '</li>';
					$("ul.home-page-cat-wise-list").find("li[data-catid='" + item["category"] + "']").after(catWiseDataObj);					
				});
			}
		}
		else {
			navigator.notification.alert('Data retrieval fail.', alertConfirm, appName,'Ok');
		}
		hideModal();
	}
	
	var booking_code_global="";
	function showMyBookingInfo(){
		var $loginForm=$("#loginForm");
		var booking_code=$loginForm.find("#username").val();
		var booking_pass=$loginForm.find("#password").val();
		
		if( booking_code!="" && booking_pass!=""){
			var mData={};
			mData["action"] = 'showMyBookingInfo';
			mData["s_key"] = window.localStorage["s_key"];
			booking_code='cZUzby6Q';
			booking_pass='SELYFK3q';
			mData["booking_code"] = booking_code;
			mData["booking_pass"] = booking_pass;
			
			booking_code_global=booking_code;
			getDataByUrlAndData(appUrl, mData, showMyBookingInfoSuccessCB, commonAppErrorCB, ajaxCallPost);
			return false;
		}
		else{
			navigator.notification.alert('You must enter credentials.', alertConfirm, appName, 'Ok');
		}
	}
	
	function showMyBookingInfoSuccessCB(data){
		var $bookingDetailsPage=$("#booking-details-page");
		var responseJson = jQuery.parseJSON(data);
		var ajaxStatus = responseJson["status"];		
		
		if(ajaxStatus == true){
			$.mobile.changePage('#booking-details-page','slide');
			
			var bookingObj = responseJson["booking"];
			var item=bookingObj;
			
			var package_name = item["package_name"];			
			var package_desc = item["package_desc"];
			var starting_dest = item["starting_dest"];
			var destination = item["destination"];
			var final_price = item["final_price"];
			var deal_price = item["deal_price"];
			var paid_total = item["paid_total"];
			
			var booking_status = item["booking_status"];
			var group_size = item["group_size"];
			var create_timestamp = item["create_timestamp"];
			
			var customersArr = item["customers"];
			
			var paymentsArr = item["payments"];
			
			$bookingDetailsPage.find(".booking-header-div .booking_code").html(booking_code_global);
			$bookingDetailsPage.find(".booking-header-div .booking_status").html(booking_status);
			$bookingDetailsPage.find("ul.booking-details-list").empty();
			
			var dataEleObj= '<li class="">'
								+ '<a href="#" class="ui-btn waves-effect">'
									+ ' <h2>' + package_name + '</h2> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-airplanemode-active zmd-fw"></i></span>' + '<span class="icon-span-data">'+ starting_dest + ' to ' + destination + '</span></p> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmd-fw">&#8377;</i></span>' + '<span class="icon-span-data">Deal Prize:'+ deal_price + ' INR </span></p> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmd-fw">&#8377;</i></span>' + '<span class="icon-span-data">Final Prize:'+ final_price + ' INR </span></p> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmd-fw">&#8377;</i></span>' + '<span class="icon-span-data">Paid Total:'+ paid_total + ' INR </span></p> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-info-outline zmd-fw"></i></span> ' + '<span class="icon-span-data">'+ package_desc + ' </span> </p> '
									+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-accounts-alt zmd-fw"></i></span> ' + '<span class="icon-span-data">Passengers: '+ group_size + ' </span> </p> '
								+ '</a> '							
							+ '</li>';
					
				$bookingDetailsPage.find("ul.booking-details-list").append(dataEleObj);

				var customersEleObj= '';
				customersEleObj+= 	'<h3 class="st-boder-dashed-top" >Passengers Details</h3>';
				$bookingDetailsPage.find(".passengers-details-list").append(customersEleObj);							
											
									
				if(customersArr.length > 0){
					
					jQuery.each(customersArr, function(custIndex, custItem) {
					
						var customer_id = custItem["customer_id"];			
						var name = custItem["first_name"] + custItem["middle_name"] + custItem["last_name"]  ;
						var gender = custItem["gender"];	
						var passport_number = custItem["passport_number"];	
						var passport_valid_date = custItem["passport_valid_date"];	
						var visa_number = custItem["visa_number"];	
						var visa_valid_date = custItem["visa_valid_date"];	
						var address_1 = custItem["address_1"];	
						var address_2 = custItem["address_2"];	
						var country_id = custItem["country_id"];	
						var state_id = custItem["state_id"];	
						var district = custItem["district"];	
						var city = custItem["city"];	
						var pincode = custItem["pincode"];	
						
						var is_leader = custItem["is_leader"];					
						var photo = custItem["photo"];	
						
						var create_timestamp = custItem["create_timestamp"];	
						var update_timestamp = custItem["update_timestamp"];	
						
						customersEleObj= 	'<div class="nd2-card st-border-sides st-teal"> '+
												'<div class="card-title " onclick="showCustInfoTemp();"> '+
													//'<img src="#" class="card-avatar"> '+
													'<h3 class="card-primary-title">'+ name +'</h3> '+
													'<h5 class="card-subtitle">'+ gender +'</h5> '+
												'</div> '+
												'<div class="card-supporting-text " > '+
													'<ul data-role="listview" data-icon="false" class="hpdiv packages-list-ui  animated fadeInDown ui-listview">'+
															'<li class="">' +
																'<a href="#" class="ui-btn">';
												if(is_leader=="1"){
													customersEleObj+=  ' <h2>Leader</h2> ';
												}
																
												customersEleObj+= ' <p><span class="icon-span medium"><i class="zmdi zmdi-account-box-o zmd-fw"></i></span>' + '<span class="icon-span-data">PP No.: '+ passport_number + '</span></p> '
																+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-calendar-note zmd-fw"></i></span>' + '<span class="icon-span-data">Passport Date:'+ passport_valid_date + ' </span></p> '
																+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-confirmation-number zmd-fw"></i></span>' + '<span class="icon-span-data">Visa No.:'+ visa_number + ' </span></p> '
																+ ' <p><span class="icon-span medium"><i class="zmdi zmdi-calendar-note zmd-fw"></i></span>' + '<span class="icon-span-data">Visa Date:'+ visa_valid_date + '</span></p> '
																+ ' <p>'
																	+'<span class="icon-span medium"><i class="zmdi zmdi-markunread-mailbox zmd-fw"></i></span> ' 
																	+ '<span class="icon-span-data">'
																		+ address_1 + ', '
																		+ address_2 + ', ' 
																		+ district + ', ' 
																		+ city + ', ' 
																		+ pincode 
																	+ ' </span> '
																+'</p> '
															+ '</a> '							
														+ '</li>'
													+'</ul> '
												+'</div> '
											'</div> ';		
						
						$bookingDetailsPage.find(".passengers-details-list").append(customersEleObj);		
					});
				}else{
					
				}	
				
				customersEleObj= 	'<h3 class="st-boder-dashed-top" style=" text-align: center;">Payment Details</h3>';
				$bookingDetailsPage.find(".passengers-details-list").append(customersEleObj);							

				if(paymentsArr.length > 0){
					
					jQuery.each(paymentsArr, function(paymentIndex, paymentItem) {
					
						var booking_payment_id = paymentItem["booking_payment_id"];			
						var booking_id = paymentItem["booking_id"];	
						var payment_type = paymentItem["payment_type"];	
						var amount = paymentItem["amount"];	
						var payment_detail = paymentItem["payment_detail"];						
						var create_timestamp = paymentItem["create_timestamp"];	
						var update_timestamp = paymentItem["update_timestamp"];	
						
						customersEleObj= 	'<div class="nd2-card st-border-sides st-light-blue"> '+
												'<div class="card-title" onclick="showCustInfoTemp();"> '+
													//'<img src="#" class="card-avatar"> '+
													'<h3 class="card-primary-title">'+ amount +'</h3> '+
													'<h5 class="card-subtitle">'+ payment_type +'</h5> '+
												'</div> '+
											'</div> ';	
						$bookingDetailsPage.find(".passengers-details-list").append(customersEleObj);							
					});
				}else{
					
				}
				
				//$bookingDetailsPage.find(".passengers-details-list").append(customersEleObj);
		}
		else {
			//$.mobile.changePage('#booking-details-page','slide');
			navigator.notification.alert('Please provide correct details.', alertConfirm, appName,'Ok');
		}
		hideModal();
	}
	
	
	
	function commonAppErrorCB(data){
		 hideModal();
		 navigator.notification.alert("Connection Problem" ,alertConfirm,appName,'Ok');
		 var responseJson = $.parseJSON(data);
		 if(responseJson.status==404){
			navigator.notification.alert("Connection Problem" ,alertConfirm,appName,'Ok');
		 }
	}
	
	function alertCustomMsg(msg){
		navigator.notification.alert(msg, alertConfirm, appName, 'Ok');	
	}
	
	// For iterateAndAppendData
	function iterateAndAppendData(array, elementObj) {
		try{
			jQuery.each(array, function(index, item) {
				console.log(item["key"] + "---" + item["value"] );
				
				//$elementObj).append();
			});
			return true;
		}catch(err){
			var txt="There was an error on this page.\n\n";
			txt+="Error description: " + err.message + "\n\n"; 
			console.log(txt);
			return false;
		}
	}
	
	// For getting Property Count of object
	function getPropertyCount(obj) {
		var count = 0,
			key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				count++;
				console.log(obj[key]);
			}
		}
		return count;
	}
	
	// For constants : Converting Obj to array 
	function getObjDataInArray(obj) {
		var count = 0,
			key, value;
		var arrayTemp=[];
		for (key in obj) {
			var objTemp={};
			objTemp["key"]=key;
			objTemp["value"]=obj[key];
			if (obj.hasOwnProperty(key)) {
				arrayTemp[count]=objTemp;
				count++;
			}
		}
		return arrayTemp;
	}
	
	
	function showFullProfilePara(){
		$(".full-profile-para").show();
		$(".full-profile-btn-div").hide();
	}
	
	function showFullChairmaneMsgPara(){
		$(".full-chairman-msg-para").show();
		$(".full-chairman-msg-btn-div").hide();
	}
	
	function dataTypeCheckJSON (someobj) {
		var dataType="";
		try {
			if (typeof someobj != 'string'){
				if(a.constructor.name === 'Array'){
					dataType="Array";
				}
				else if(a.constructor.name === 'Object'){
					dataType="Object";
				}
			}else if (typeof someobj == 'string'){
				dataType="string";
			}else{
				dataType="other";
			}
		} catch (e) {
			dataType="other";
		}
		return dataType;
	}
	
	function registerAppId(){
		var gcmregistrationIdTemp=window.localStorage["gcmregistrationId"];
		
		if( gcmregistrationIdTemp!=""){
			var mData={};
			mData["action"] = 'saveGCM';
			mData["s_key"] = window.localStorage["s_key"];
			mData["gcm"] = gcmregistrationIdTemp;
			
			getDataByUrlAndData(appUrl, mData, registerAppIdSuccessCB, commonAppErrorCB, ajaxCallPost);
			return false;
		}
		else{
			//navigator.notification.alert('Error while updating app id, close app and restart.', alertConfirm, appName, 'Ok');
		}
	}
	
	function registerAppIdSuccessCB(data){
		hideModal();
		var responseJson = jQuery.parseJSON(data);
		var ajaxStatus = responseJson["status"];
		
		if(ajaxStatus == "success"){
			window.localStorage["isgcmregistered"] = 1;
		}
	}
	
	//First step check parameters mismatch and checking network connection if available call    download function
	function downloadFileByUrlCheck(URL, Folder_Name, File_Name) {
	//Parameters mismatch check
	if (URL == null && Folder_Name == null && File_Name == null) {
		return;
	}
	else {
		//checking Internet connection availablity
		connectionType=checkConnection();
		if(connectionType=="No network connection"){
			return;
		} else {
			downloadFileByUrl(URL, Folder_Name, File_Name); //If available download function call
		}
	  }
	}
	
	function downloadFileByUrl(URL, Folder_Name, File_Name) {
	
		
	
	
		//step to request a file system 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

		function fileSystemSuccess(fileSystem) {
			var download_link = encodeURI(URL);
			ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

			var directoryEntry = fileSystem.root; // to get root path of directory
			directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
			var rootdir = fileSystem.root;
			var stFullPath = rootdir.fullPath; // Returns Fulpath of local directory
			// fullpath and name of the file which we want to give
			stFullPath = stFullPath + "/" + Folder_Name + "/" + File_Name + "." + ext; 
			// download function call
			filetransferByDownloadLink(download_link, stFullPath);
		}

		function onDirectorySuccess(parent) {
			// Directory created successfuly
			alert("Create new directory Success: ");
		}

		function onDirectoryFail(error) {
			//Error while creating directory
			alert("Unable to create new directory: " + error.code);
		}

		function fileSystemFail(evt) {
			//Unable to access file system
			alert(evt.target.error.code);
		}
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function gotFS(fileSystem) {
			   fileSystem.root.getDirectory("user_data", {create: true}, 
					function fileSystemSuccess(fileSystem){
						
						fileSystem.getFile(File_Name+".png",{create: true,exclusive:false},
							function gotFileEntry(fileEntry){
								var path = fileEntry.fullPath.replace(File_Name+".png", "");
								fileEntry.remove();
								var fileTransfer = new FileTransfer();
								
								fileTransfer.download(URL, path+""+File_Name+".png",function(theFile){
									alert("File Downloaded Successfully " + theFile.toURI());
								},
								function(error){
									alert("File Transfer failed" + error.message);
								});
							},
						fail);
					});
			}, 
			fail
		);
	}
	
	function filetransferByDownloadLink(download_link, stFullPath) {
		var fileTransfer = new FileTransfer();
		// File download function with URL and local path
		fileTransfer.download(download_link, stFullPath,
				function (entry) {
					alert("download complete: " + entry.fullPath);
				},
				function (error) {
					//Download abort errors or download failed errors
					alert("stFullPath-"+stFullPath);
					alert("download error source " + error.source);
					alert("download error target " + error.target);
					alert("upload error code" + error.code);
				}
		);
	}
	