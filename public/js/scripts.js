$(document).ready(function(){
	$('#addpanel').css('display', 'none');
	$('#add').click(function(){
		$('#filterpanel').hide();
		$('#addpanel').show();
	})
	
	$('#filterpanel').css('display', 'none');
	$('#filter').click(function(){
		$('#addpanel').hide();
		$('#filterpanel').show();
	})
})