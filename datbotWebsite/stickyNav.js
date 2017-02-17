$(document).ready(function(){

	var aboveHeight = $('#header').outerHeight();
	//console.log(aboveHeight);

	$(window).scroll(function(){
		//console.log($(window).scrollTop());
		if ($(window).scrollTop() > aboveHeight){
			//console.log('STICKY ACTIVATE!!');
			$('#navList').addClass('fixed').css('top','0');
		} else {
			//console.log('STICKY DEACTIVATE!!');
			$('#navList').removeClass('fixed').css('top','0');
		}

	});
});