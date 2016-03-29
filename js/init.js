(function($){
  $(function(){
	  
	var days = {};
	days["Monday"] = "Måndag";
	days["Tuesday"] = "Tisdag";
	days["Wednesday"] = "Onsdag";
	days["Thursday"] = "Torsdag";
	days["Friday"] = "Fredag";
	days["Saturday"] = "Lördag";
	days["Sunday"] = "Söndag";
	
	if(localStorage.getItem("restaurants") == undefined){
		var restaurants = ["Restaurang Niagara", "Mia Maria", "La Bonne Vie", "Välfärden", "Lilla Köket"];
		localStorage.setItem("restaurants", JSON.stringify(restaurants));
	}else{
		var restaurants = JSON.parse(localStorage.getItem("restaurants"));
	}

    $('.button-collapse').sideNav();
	initDay();
	
	$(".nav-wrapper #nav-mobile a, .nav-wrapper .hide-on-med-and-down a").on("click", function(){
		$("body > .page").fadeOut(250);
		$($(this).attr("href")).delay(250).fadeIn(250);
		if($(this).attr("href") == "#week-page"){
			initWeek();
		}else if($(this).attr("href") == "#day-page"){
			initDay();
		}else if($(this).attr("href") == "#setting-page"){
			initSetting();
		}
		$('.button-collapse').sideNav('hide');
	});
	
	function initSetting(){
		var restaurants = JSON.parse(localStorage.getItem("restaurants"));
		for(restaurant in restaurants){
			str = restaurants[restaurant].replace(/ /g, '-');
			$("#"+str).prop("checked", true);
		}
	}
	
	$("#view-settings input").on("change", function(){
		var arr = [];
		$.each($("#view-settings input"), function(){
			if($(this).prop("checked") == true){
				str = $(this).attr("id").replace(/-/g, ' ');
				arr.push(str);
			}
		});
		var restaurants = arr;
		localStorage.setItem("restaurants", JSON.stringify(arr));
	});
	
	function initDay(){
		var restaurants = JSON.parse(localStorage.getItem("restaurants"));
		var utc = new Date().toJSON().slice(0,10);
		if(localStorage.getItem("todaysLunchDate") == undefined || localStorage.getItem("todaysLunchDate") != utc){	
			$.ajax({
				url: "http://mahlunch.antontibblin.se/today",
				dataType: "JSON"
			}).done(function(data){
				localStorage.setItem("todaysLunch", JSON.stringify(data));
				var utc = new Date().toJSON().slice(0,10);
				localStorage.setItem("todaysLunchDate", utc);
				$("#loading").fadeOut(450);
				$("#lunch-area").html("");
				for(var restaurant in data){
					$("#lunch-area").hide().append(createDailyMenu(restaurant, data[restaurant])).delay(500).fadeIn(500);
				}
			});
		}else{
			var data = JSON.parse(localStorage.getItem("todaysLunch"));
			$("#loading").fadeOut(250);
			$("#lunch-area").html("");
			for(var restaurant in data){
				$("#lunch-area").hide().append(createDailyMenu(restaurant, data[restaurant])).delay(250).fadeIn(500);
			}
		}
		
		function createDailyMenu(restaurant, menuJson){
		  var menu = "";
		  if(restaurants.indexOf(restaurant) != -1){
			      menu = '<div class="col s12 center" style="border-bottom: 1px solid #eee;">';
				  menu +='<h5 class="center">'+restaurant+'</h5>';
				  menu +='<p class="light">';
				  for(var item in menuJson){
					  price = "";
					  if(menuJson[item].price.length > 0){
						  price = "("+menuJson[item].price+"kr)";
					  }
					  menu += "<p><b>"+item+"</b>: "+menuJson[item].title+price+"</p>";
				  }
				  menu +='</p>';
				  menu +='</div>';
				  menu +='</div>';
		  }
		  return menu;
		}
	}
	
  function initWeek(){
	  var restaurants = JSON.parse(localStorage.getItem("restaurants"));
	  var utc = new Date().toJSON().slice(0,10);
		if(localStorage.getItem("weeksLunchDate") == undefined || localStorage.getItem("weeksLunchDate") != utc){	
			$.ajax({
				url: "http://mahlunch.antontibblin.se/",
				dataType: "JSON"
			}).done(function(data){
				$("#week-lunch-area").html("");
				localStorage.setItem("weeksLunch", JSON.stringify(data));
				var utc = new Date().toJSON().slice(0,10);
				localStorage.setItem("weeksLunchDate", utc);
				$("#loading-week").fadeOut(450);
				for(var restaurant in data){
					$("#week-lunch-area").hide().append(createWeekMenu(restaurant, data[restaurant])).delay(500).fadeIn(500);
				}
			});
		}else{
			$("#week-lunch-area").html("");
			var data = JSON.parse(localStorage.getItem("weeksLunch"));
			$("#loading-week").fadeOut(250);
			for(var restaurant in data){
				$("#week-lunch-area").hide().append(createWeekMenu(restaurant, data[restaurant])).delay(250).fadeIn(500);
			}
		}
		
		function createWeekMenu(restaurant, menuJson){
		  var menu = "";
		  if(restaurants.indexOf(restaurant) != -1){
			  menu = "<h5 class='center'>"+restaurant+"</h5>";
			  for(var day in menuJson){
					  menu +='<div class="col s12 center" style="border-bottom: 1px solid #eee;">';
					  menu +='<h6 class="center" style="font-weight:bold">'+days[day]+'</h6>';
					  menu +='<p class="light">';
					  for(var item in menuJson[day]){
						  price = "";
						  if(menuJson[day][item].price.length > 0){
							  price = "("+menuJson[day][item].price+"kr)";
						  }
						  menu += "<p><b>"+item+"</b>: "+menuJson[day][item].title+price+"</p>";
					  }
					  menu +='</p>';
					  menu +='</div>';
					  menu +='</div>';
			  }
			  menu += "<hr>";
		  }
		  return menu;
		}
  }

  }); // end of document ready
})(jQuery); // end of jQuery name space