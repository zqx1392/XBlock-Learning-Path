/* Javascript for MyXBlock. */
function LinkBlock(runtime, element) {


    /* DEFINE URL(FUNCTION) TO USE FROM MYXBLOCK.PY, IN THIS CASE WE CALL FUNCTION */
	//link to get_answer function in python server
	/*
    var checkUrl = runtime.handlerUrl(element,'get_answer');
	var LOLinkUrl = runtime.handlerUrl(element,'get_lo');
	$('.linker-button',element).click(function(){
		var html_location = $('#linker-html-link',element).attr("href");
		html_location = html_location.substring(0,html_location.length-1);
		html_location += LO_LINK;
		$('#lo-linker',element).find("#linker-html-link").attr("onclick","location.href='"+ html_location + "';");
	});
	*/

    





    $(function ($) {
        /* Here's where you'd do things on page load. */
		var html_location = $('#linker-html-link',element).attr("href");
		html_location = html_location.substring(0,html_location.length-1);
		html_location += LO_LINK;
		$('#lo-linker',element).find("#linker-button").attr("onclick","location.href='"+ html_location + "';");
		if (LO_LINK == "") $('#lo-linker',element).addClass("hidden");
    });
}
