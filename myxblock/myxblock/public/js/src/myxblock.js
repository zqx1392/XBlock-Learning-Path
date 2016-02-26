/* Javascript for MyXBlock. */
function MyXBlock(runtime, element) {


    /* DEFINE URL(FUNCTION) TO USE FROM MYXBLOCK.PY, IN THIS CASE WE CALL FUNCTION */
	//link to get_answer function in python server
    var checkUrl = runtime.handlerUrl(element,'get_answer')


	//choose all element that is <input type="radio">
    var answers = $('input[type=radio]', element);
	// count total question which representing users.
    var current_question_number = 1;
	// count total correct sub question
	var count_correct_sub_question = 0;
    $('.check', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: checkUrl,
			//get data from gather...() function
            data: JSON.stringify(gatherStudentChoices()),
            success: function (data) {
				//if success update UI
			    $.each(data.Results, function(question_number, sub_question){									
					$.each(sub_question, function(sub_question_number, result){
						question_number = parseInt(question_number);
						sub_question_number = parseInt(sub_question_number);
						//show green or red border with correct/incorrect icon			
						updateAnswerUI(result);
						//show next main question if the answer is correct and the answered question is also main question
						if (result == 'true' && sub_question_number == 0)
							showNextQuestion(question_number);
						//in case it is incorrect answer, just show its subquestion. if the question is also subquestion itself, just show next subquestion regardless of right/wrong.
						else{
							if (result == 'true')
								count_correct_sub_question++; 
							showSubQuestion(question_number,sub_question_number);
						}
						//update UI to disable the answered question
						disableQuestion(question_number,sub_question_number);			
					});
					
			    }); 
            },
	   		error: function (textStatus, errorThrown) {
                alert (textStatus);
            }
        });
    });
    

   
    // Gather selected choices and send it to AJAX function
    var gatherStudentChoices = function () {
        // Grabs all selections for student's answers, and returns a mapping for them.
        var choices = {};
        answers.each(function(index, el) {
            el = $(el);
            choices[el.prop('name')] = $(checkedElement(el), element).val();
        });
        return choices;
    };
    // Find a selected choice in HTML
    var checkedElement = function ( el ) {
        // Given the DOM element of a radio, get the selector for the checked and enabled(not disabled) element
        // with the same name.
        return "input[name='" + el.prop('name') + "']:enabled:checked"
    };
	
	// Show sub question after a student answered a question wrong.
    var showSubQuestion = function( question_number, sub_question_number ){
			//if it is not the third subquestion
			if (sub_question_number < 3){				
				sub_question_number++;				
				current_question_number++;			
				$('#question-' + question_number + 's' + sub_question_number, element).removeClass("hidden").find("p").prepend(current_question_number+". ");			
			}
			//In case it is the third subquestion and a student answered all 3 subquestion correctly, show next main question
			else if (count_correct_sub_question == 3){
				count_correct_sub_question = 0;
				showNextQuestion(question_number);
			}
			else {
				count_correct_sub_question = 0;
				showLOLinkPopup(question_number);
			}
	};
    // Show next question after a student answered a question correct.
    var showNextQuestion = function( question_number){
		q_num = question_number + 1;
		current_question_number++;
		$('#question-' + q_num + 's0', element).removeClass("hidden").find("p").prepend(current_question_number+". ");
		
	};
	//disable a question after a student answered
	var disableQuestion = function( question_number, sub_question_number ){
		$('#question-' + question_number + 's' + sub_question_number, element).addClass("disabledbutton");
        $('#question-' + question_number + 's' + sub_question_number + ' :input',element).attr('disabled', true);
	};
	//show correct or incorrect icon on UI, and highlight a selected choice with red or green border.
	var updateAnswerUI = function(result){
		if (result == 'true')
			$("input[type=radio]:enabled:checked",element).parent().css("border-color", "rgb(29, 147, 72)").append("<img src=" + CORRECT_ICON + "></img>");
		else
			$("input[type=radio]:enabled:checked",element).parent().css("border-color", "rgb(178, 6, 16)").append("<img src=" + INCORRECT_ICON + "></img>");	
	};
	
	var showLOLinkPopup = function(question_number){
		//activate modal
		
	};
	

 
 
	
	/* ---------------------------------------------------------------  CSS RELATE */

    $('label',element).hover(function(){
		$(this).css( "border-color", "rgb(0, 120, 167)");
        }, function(){
        $(this).css("border-color", "rgb(227, 227, 227)");
    });

    /* ---------------------------------------------------------------  END OF CSS RELATE */
    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
