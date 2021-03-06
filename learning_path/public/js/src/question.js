/* Javascript for QuestionXBlock. */
function QuestionBlock(runtime, element) {

	// Get the modal
	var modal = document.getElementById('result-modal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close-self-modal")[0];
	var close_button = document.getElementById('result-button');

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}
	close_button.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
		    modal.style.display = "none";
		}
	}

    /* DEFINE URL(FUNCTION) TO USE FROM MYXBLOCK.PY, IN THIS CASE WE CALL FUNCTION */
		//link to get_answer function in python server
	var checkUrl = runtime.handlerUrl(element,'get_answer');
	var finishTestUrl = runtime.handlerUrl(element,'finish_test');
	var loadChoiceUrl = runtime.handlerUrl(element,'load_choice');

	//choose all element that is <input type="radio">
	var answers = $('input[type=radio]', element);
	// count total question which representing users.
	var current_question_number = 1;
	// count total correct sub question
	var count_correct_sub_question = 0;
	// set current sub question number
	var current_total_sub_question = 0;
	// check whether a student can skip lesson or not
	var skip_test = true;
	
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
						if (sub_question_number == 1 ) { 
							current_total_sub_question = data.sub_question_count -1;
							if (result == 'true'){
								showNextQuestion(question_number);
							}
							else {
								skip_test = false;
								if (current_total_sub_question>0){
									showSubQuestion(question_number,sub_question_number);	
								}
								else {
									if (data.has_lo_link){
										showLOLinkPopup(question_number,sub_question_number);
									}
									else {
										
										showNextQuestion(question_number);
									}
								}
							}
						}
						else {
							if (result == 'true'){
								count_correct_sub_question++;
								showSubQuestion(question_number,sub_question_number);
							}
							else {
								showLOLinkPopup(question_number,sub_question_number);
									
							}
						}
						//show green or red border with correct/incorrect icon			
						updateAnswerUI(result);
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
			//if it is not the last subquestion
			if (sub_question_number < current_total_sub_question + 1){		
				sub_question_number++;				
				current_question_number++;			
				$('#question-' + question_number + 's' + sub_question_number, element).appendTo("#question-area");
				$('#question-' + question_number + 's' + sub_question_number, element).removeClass("hidden").find("p").prepend(current_question_number+". ");			
			}
			//In case it is the last subquestion and a student answered all 3 subquestion correctly, show next main question
			//else if (count_correct_sub_question == current_total_sub_question){
			else {
				count_correct_sub_question = 0;
				showNextQuestion(question_number);
			}
			/*
			else {
				count_correct_sub_question = 0;
				getLOLink(question_number);
			}
			*/
	};
    // Show next question after a student answered a question correct.
    var showNextQuestion = function( question_number){
		
		q_num = question_number + 1 ;
		current_question_number++;
		//student answer all questions correctly
		if(q_num > TOTAL_QUESTION){
			showLOLinkPopup(q_num,"");
		}
		$('#question-' + q_num + 's1', element).appendTo("#question-area");
		$('#question-' + q_num + 's1', element).removeClass("hidden").find("p").prepend(current_question_number+". ");
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

	//show result in html
	var showLOLinkPopup = function(question_number,sub_question_number){
		//Student fails the test.
		if (question_number <= TOTAL_QUESTION){
			var test_result = {'result':'failed'};
			test_result['question_num'] = question_number;
			test_result['sub_question_num'] = sub_question_number;
			$.ajax({
		        type: "POST",
		        url: finishTestUrl,
		        data: JSON.stringify(test_result),
		        success: function (lo_data) {
				var url = lo_data.learning_object_url;
				var header = lo_data.learning_object_name;
				$("#result-text").append("Your prerequisite lesson is " + header);
				var html_location = $('#html-link',element).attr("href");
				html_location = html_location.substring(0,html_location.length-1);
				html_location += url;
				$("#result-button").attr("onclick","location.href='"+ html_location + "';");
				$("#result-button").text("Go to the lesson");
				modal.style.display = "block";
				//block-v1:Right+1101+2016_T1+type@link+block@4429c2de8f854132a3a5d19c1c2e3b2e
		        },
		   		error: function (textStatus, errorThrown) {

		        }
		    });
		}
		//Student passes the test and answers every question correctly.
		else if (skip_test){
			var test_result = {'result':'passed'};
			$.ajax({
		        type: "POST",
		        url: finishTestUrl,
		        data: JSON.stringify(test_result),
		        success: function (data) {			
					$("#result-text").text("You have passed the test and the result is you are able to skip this lesson!");
					modal.style.display = "block";
		        },
		   		error: function (textStatus, errorThrown) {

		        }
		    });
		}
		//Student passes the test but answers a question wrong.
		else{
			var test_result = {'result':'passed'};
			$.ajax({
		        type: "POST",
		        url: finishTestUrl,
		        data: JSON.stringify(test_result),
		        success: function (data) {		
					$("#result-text").text("You don't pass the test and should learn this lesson.");
					modal.style.display = "block";
		        },
		   		error: function (textStatus, errorThrown) {

		        }
		    });
		}	
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
/*
		var zzz = {};
			$.ajax({
		        type: "POST",
		        url: loadChoiceUrl,
		        data: JSON.stringify(zzz),
		        success: function (data) {
					$.each(data.choices, function(question_number, sub_question){						
						if (sub_question.choice != ""){
							var result = sub_question.result;
							var choice = sub_question.choice;
							//show green or red border with correct/incorrect icon			
							if (result == 'true')
								$("input[id='answer"+question_number+"'][value='"+choice+"']",element).parent().attr("id","right").css("border-color", "rgb(29, 147, 72)").append("<img src=" + CORRECT_ICON + "></img>");
							else
								$("input[id='answer"+question_number+"'][value='"+choice+"']",element).parent().attr("id","wrong").css("border-color", "rgb(178, 6, 16)").append("<img src=" + INCORRECT_ICON + "></img>");
							var num = question_number.split(".");
							if (question_number != '1.1'){
								$('#question-' + num[0] + 's' + num[1], element).removeClass("hidden");	
							}
							
							disableQuestion(parseInt(num[0]),parseInt(num[1]));				
						}
					}); 
					var i=1,j=2;
					while (i>0){
						if (i!=1) j=1;
						while (j>0){
					        var k = j-1;
							if ($('#question-' + i + 's' + j, element).length && !$('#question-' + i + 's' + j, element).hasClass("hidden")){
								current_question_number++;
								$('#question-' + i + 's' + j, element).find("p").prepend(current_question_number+". ").appendTo("#question-area");
								$('#question-' + i + 's' + j, element).appendTo("#question-area");
								
							}

							else if ($('#question-' + i + 's' + j, element).length && $('#question-' + i + 's' + k, element).find("label[id=right]").length && k != 1 ) {
								current_question_number++;
								$('#question-' + i + 's' + j, element).find("p").prepend(current_question_number+". ").appendTo("#question-area");
								$('#question-' + i + 's' + j, element).appendTo("#question-area");
								$('#question-' + i + 's' + j, element).removeClass("hidden");
								i = -1;	
								break;

							}
							else if ($('#question-' + i + 's' + j, element).length && $('#question-' + i + 's' + k, element).find("label[id=wrong]").length ) {
								current_question_number++;
								$('#question-' + i + 's' + j, element).find("p").prepend(current_question_number+". ").appendTo("#question-area");
								$('#question-' + i + 's' + j, element).appendTo("#question-area");
								$('#question-' + i + 's' + j, element).removeClass("hidden");
								i = -1;	
								break;

							}
							else break;
							j++;
						}
						if ($('#question-' + i + 's' + j, element).length && $('#question-' + i + 's1', element).find("label[id=right]").length && j-1 == 1 ) {
								current_question_number++;
								$('#question-' + i + 's' + j, element).find("p").prepend(current_question_number+". ").appendTo("#question-area");
								$('#question-' + i + 's' + j, element).appendTo("#question-area");
								$('#question-' + i + 's' + j, element).removeClass("hidden");
								i = -1;	
								break;

						}
						if (!$('#question-' + i + 's1', element).length) break;
						i++;
					}
		        },
		   		error: function (textStatus, errorThrown) {

		        }
		    });
					*/
    });
}

