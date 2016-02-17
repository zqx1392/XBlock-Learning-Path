/* Javascript for MyXBlock. */
function MyXBlock(runtime, element) {

    function updateCount(result) {
        $('.count', element).text(result.count);
    }
    /* DEFINE URL(FUNCTION) TO USE FROM MYXBLOCK.PY, IN THIS CASE WE CALL FUNCTION */
    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    $('p', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"hello": "world"}),
            success: updateCount
        });
    });

    $('label',element).hover(function(){
	$(this).css( "border-color", "rgb(0, 120, 167)");
        }, function(){
        $(this).css("border-color", "rgb(227, 227, 227)");
    });
    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
