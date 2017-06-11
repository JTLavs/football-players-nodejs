$(document).ready(function(){
	console.log('js loaded');
	$('#addpanel').css('display', 'none');
	$('#add').click(function(){
		$('#addpanel').slideToggle();
	})
})