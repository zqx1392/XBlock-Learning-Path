/* Javascript for MyXBlock. */
function LinkBlock(runtime, element) {
	var clearData = runtime.handlerUrl(element,'clear_data');
	$('#clear-history', element).click(function(eventObject) {
		var zzz = {'ha':'ho'};
        $.ajax({
            type: "POST",
            url: clearData,
			//get data from gather...() function
            data: JSON.stringify(zzz),
            success: function (data) {alert("Test History has been cleared successfully"); window.location.reload(true);},
	   		error: function (textStatus, errorThrown) {

	        }
		});
	});
  

    





    $(function ($) {
        /* Here's where you'd do things on page load. */
		var html_location = $('#linker-html-link',element).attr("href");
		html_location = html_location.substring(0,html_location.length-1);
		html_location += LO_LINK;
		$('#lo-linker',element).find("#linker-button").attr("onclick","location.href='"+ html_location + "';");
		if (LO_LINK == "") $('#lo-linker',element).addClass("hidden");
    });
}
