/* Javascript for MyXBlock. */
function MyXBlock(runtime, element) {


    /* DEFINE URL(FUNCTION) TO USE FROM MYXBLOCK.PY, IN THIS CASE WE CALL FUNCTION */
    var handlerUrl = runtime.handlerUrl(element, 'increment_count');
    var checkUrl = runtime.handlerUrl(element,'get_answer')
    var answers = $('input[type=radio]', element);

    $('.check', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: checkUrl,
            data: JSON.stringify(gatherStudentChoices()),
            success: function (data) {
                alert(JSON.stringify(data.Results));
            },
	    error: function (textStatus, errorThrown) {
                alert ('no');
            }
        });
    });
    var gatherStudentChoices = function () {
        // Grabs all selections for student's answers, and returns a mapping for them.
        var choices = {};
        answers.each(function(index, el) {
            el = $(el);
            choices[el.prop('name')] = $(checkedElement(el), element).val();
        });
        return choices;
    };

    var checkedElement = function (el) {
        // Given the DOM element of a radio, get the selector for the checked element
        // with the same name.
        return "input[name='" + el.prop('name') + "']:checked"
    };

    $('label',element).hover(function(){
	$(this).css( "border-color", "rgb(0, 120, 167)");
        }, function(){
        $(this).css("border-color", "rgb(227, 227, 227)");
    });
    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
