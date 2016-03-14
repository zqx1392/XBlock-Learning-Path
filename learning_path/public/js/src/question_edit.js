function QuestionEditBlock(runtime, element) {

    /* Html element used to alert users, in case of an error */
    $('.xblock-editor-error-message', element).css('display', 'none');
    $('.xblock-editor-error-message', element).css('color', 'red');

    /* Click event for Cancel button, while in the edit mode */
    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });
	function isPositiveInteger(s)
	{
		var i = +s; // convert to a number
		if (i <= 0) return false; // make sure it's positive
		if (i != ~~i) return false; // make sure there's no decimal part
		return true;
	}
	function checkUserInput(){
		if (!$(element).find('input[id=edit_title_name]').val()){
			alert ("Please input the test's title name");		
			return false;
		}
		if (!$('#edit_test_type').val()){
			alert ("Please choose the test type");		
			return false;
		}
		if ( isNaN($(element).find('input[id=edit_total_question]').val()) || !isPositiveInteger($(element).find('input[id=edit_total_question]').val()) ){
			alert ("Please input correct number in total main question number");		
			return false;
		}
		nGroups = $(element).find('input[id=edit_total_question]').val();
		for (var i=1;i<=nGroups;i++){
			if (isNaN($(element).find('input[id=edit_total_sub_question_' + i + ']').val()) || !isPositiveInteger($(element).find('input[id=edit_total_sub_question_' + i + ']').val()) ){
				alert ("Please input correct number in total sub question number for Q" + i);
				return false;
			}
			var total_sub_question = $(element).find('input[id=edit_total_sub_question_' + i + ']').val();
            for (var j=1;j<=total_sub_question;j++){

               if (!$(element).find('input[name=question' + i + '\\.'+ j + ']').val()){
					alert ("Please input a question on Q" + i + "." + j);
					return false;				
				}
				var isChecked = false;	
				for (var k=1;k<=4;k++){
					if (!$(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val()){
						alert ("Please input an answer for Q" + i + "." + j);
						return false;
					}

					if ( $(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')){
					 isChecked = true;
					}

				}
				if (!isChecked){
					alert ("Please select one correct answer in Q" + i +  "." + j);
					return false;
				}

			   }
            if (!$(element).find('input[name=lo' + i + '_link]').val()){
				alert ("Please input learning object link for Q" + i);
				return false;
			}
			if (!$(element).find('input[name=lo' + i + '_name]').val()){
				alert ("Please input learning object name for Q" + i);
				return false;
			}
        }
		return true;
	}
    /* Click event for Save button, while in the edit mode */
    /* Gets all the input values and sends them back to model */
    $(element).find('.save-button').bind('click', function() {
		if (!checkUserInput()){
			return 0;
		}
        /* Get groups */
        questions = [];
        answers = [];
        learning_object_url = [];
        learning_object_name = [];
        nGroups = $(element).find('input[id=edit_total_question]').val();

        var question_name, answer,lo_url,lo_name;
		for (var i=1;i<=nGroups;i++){
            questions.push([String(i)]);
            answers.push([]);
            lo_url = $(element).find('input[name=lo' + i + '_link]').val();
            lo_name = $(element).find('input[name=lo' + i + '_name]').val();
            learning_object_url.push(lo_url);
            learning_object_name.push(lo_name);
            var temp_questions = {};
            var temp_answers = {};
			var total_sub_question = $(element).find('input[id=edit_total_sub_question_' + i + ']').val();
            for (var j=1;j<=total_sub_question;j++){
               question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
               temp_questions[String(j)] = question_name;
			   var temp_sub_answer = [];
               for (var k=1;k<=4;k++){
                  answer = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
				  temp_sub_answer.push(answer);	
                  if ( $(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')){
                     answers[i-1].push(answer);
                  }

               }
			   temp_answers[String(j)] = temp_sub_answer;

			   }
            questions[i-1].push(temp_questions);
            questions[i-1].push(temp_answers);
        }
        /* Data for the model */
        var data = {
            'display_name': $('#edit_title_name', element).val(),
            'test_type': $(element).find('#edit_test_type > option:selected ').val(),
            'total_question': $('#edit_total_question', element).val(),
            'questions': questions,
            'answers': answers,
            'learning_object_url': learning_object_url,
            'learning_object_name': learning_object_name,
			'temperVar' : 'You have uploaded'
        };

        /* AJAX call and its handler */

        var handlerUrl = runtime.handlerUrl(element, 'edit_questions');
        $.ajax({
           type: "POST",
           url: handlerUrl,
           data: JSON.stringify(data),
           success: function(response) {
               if (response.result === 'success') {
                   window.location.reload(true);
               } else {
                   $('.xblock-editor-error-message', element).html('Error: '+response.message);
                   $('.xblock-editor-error-message', element).css('display', 'block');
               }
            },
           error: function (textStatus, errorThrown) {
              alert (textStatus);
           }
        });

    });
	/* select checkbox only 1 answer per question */
	$(document).on('click', 'input:checkbox', function() { 
	//$("input:checkbox").on('click', function() {
	  // in the handler, 'this' refers to the box clicked on
	  var $box = $(this);
	  if ($box.is(":checked")) {
		// the name of the box is retrieved using the .attr() method
		// as it is assumed and expected to be immutable
		var group = "input:checkbox[name='" + $box.attr("name") + "']";
		// the checked state of the group/box on the other hand will change
		// and the current value is retrieved using .prop() method
		$(group).prop("checked", false);
		$box.prop("checked", true);
	  } else {
		$box.prop("checked", false);
	  }
	});
	$(document).on('click','.min-max-button',function(){
		if($(this).html() == "-"){
		    $(this).html("+");
		}
		else{
		    $(this).html("-");
		}
		var num = $(this).attr("id");
		$("#question-group-" + num).slideToggle();
	});
	/* Check the validity of data in text box for editing number of avaliable subquestion
       when user chooses to enter the data from keyboard */
	$(document).on('keyup','.edit_sub_number',function(){
		var question_num = $(this).val();
		if (question_num>=1){
			GenerateDynamicSubQuestions(element,this);
		}
	});
	/* Dynamically recreates html text inputs for sub question number in case user chooses to interact with the control using up and down buttons */
	$(document).on('change','.edit_sub_number',function(){
		var question_num = $(this).val();
		if (question_num>=1){
			GenerateDynamicSubQuestions(element,this);
		}
	});
    /* Validates user input for group values */
    $(element).on('keyup', 'input.group-value', function(){
        ValidateTextData(this, element, "Group value", 0);
    });


    /* Check the validity of data in text box for editing number of available main question
       when user chooses to enter the data from keyboard */
    $(element).on('keyup', '#edit_total_question', function(){
		var question_num = $(this).val();
		if (question_num>=1){
			GenerateDynamicInputs(element, this);
		}
        
    });

    /* Dynamically recreates html text inputs for main question number in case user chooses to interact with the control using up and down buttons */
    $(element).on('change', '#edit_total_question', function(){
        var question_num = $(this).val();
		if (question_num>=1){
        	GenerateDynamicInputs(element, this);
		}
    });

    /*
        Validates data entered within text html input field
        Parameters: -validated html input element
                    -XBlock element sent from server side
                    -description name of the validated element
                    -minimum value
    */
    function ValidateTextData(textElement, element, name, minValue) {
        var txtValue = $(textElement).val();
        if (isNaN( txtValue )){
            $(textElement).val(minValue);
            $('.xblock-editor-error-message', element).html(name + ' must be a number.');
            $('.xblock-editor-error-message', element).css('display', 'block');
        }
        else if (txtValue < 0){
            $(textElement).val(txtValue.substring(1));
            $('.xblock-editor-error-message', element).html(name + ' must be a positive number.');
            $('.xblock-editor-error-message', element).css('display', 'block');
        }
        else {
            $('.xblock-editor-error-message', element).css('display', 'none');
        }
    }

    /*
        Validates data entered within numeric html input field
        Parameters: -validated html input element
                    -XBlock element sent from server side
                    -description name of the validated element
                    -minimum value
                    -maximum value
    */
    function ValidateNumericData(numericElement, element, name, minValue, maxValue) {
        var nmbValue = $(numericElement).val();

        if (nmbValue < minValue) {
            $('.xblock-editor-error-message', element).html(name + ' must be a positive number.');
            $('.xblock-editor-error-message', element).css('display', 'block');
            nmbValue = minValue;
        } else if (nmbValue > maxValue) {
            $('.xblock-editor-error-message', element).html('Maximum ' + name.toLowerCase() + ' is ' + maxValue + '.');
            $('.xblock-editor-error-message', element).css('display', 'block');
            nmbValue = maxValue;
        } else {
            $('.xblock-editor-error-message', element).css('display', 'none');
        }

        $(numericElement).val(nmbValue);
    }
	function GenerateDynamicSubQuestions(element, groupElement){
		var id_string = $(groupElement).attr("id");
		var i = id_string.substring(24,id_string.length);
		var html_String = "";
		var total_sub = $(groupElement).val();
		for (var j=1;j<=total_sub;j++){
			var question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
				   if (question_name == null){question_name = "";}
		           	html_String += '<div class="wrapper-comp-setting"><label class="label setting-label">Q' + i + '.' + j +'</label> <input class="input setting-input question-name" name="question' + i + '.' + j +'" id="question' + i + '.' + j +'" value="' + question_name + '" type="text"></div>';
					for (var k=1;k<=4;k++){
					  var ischecked = "";
					  if ($(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')) {  ischecked = "checked";}
					  var ans = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
					  if (ans == null){ans = "";}
		              	html_String += '<div class="wrapper-comp-setting"><label class="label setting-label">Answer ' + k + '</label><input class="input setting-input answer-name" name="answer' + i  +'.' + j + '_' + k +'" id="answer' + i +'.' + j + '_' + k +'"  value="' + ans +'" type="text"><span class="tip setting-help"><input class="checkboxer" name="answer' + i  +'.' + j + '_cb" id="answer' + i  +'.' + j + '_' + k +'_cb" type="checkbox" '+ ischecked+'></span></div>';
					  
		           }
		}
		$("#summary"+i+"", element).html(html_String);
		
	}
    /* Generates label and inputs for each group, depending on the entered number of available groups */
    function GenerateDynamicInputs(element, groupElement) {
        var nGroups = $(groupElement).val();

        var html_String = "";
        var question_name, ans,lo_url,lo_name;

        for (var i=1;i<=nGroups;i++){
			var total_sub = $(element).find('input[id=edit_total_sub_question_'+i+']').val();
			if (total_sub == null) total_sub = 1;
            html_String += '<li class="field comp-setting-entry is-set"><div class="wrapper-comp-setting"><label class="label setting-label">Q'+i+': Total question</label><input class="input setting-input edit_sub_number" id="edit_total_sub_question_'+i+'" value="'+total_sub+'" type="number" ><div class="min-max-button" id="'+i+'">-</div></div><div id = "question-group-'+ i +'"><div class="edit_sub_number" id="summary'+i+'">';
			
            for (var j=1;j<=total_sub;j++){
			   question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
			   if (question_name == null){question_name = "";}
               	html_String += '<div class="wrapper-comp-setting"><label class="label setting-label">Q' + i + '.' + j +'</label> <input class="input setting-input question-name" name="question' + i + '.' + j +'" id="question' + i + '.' + j +'" value="' + question_name + '" type="text"></div>';


               for (var k=1;k<=4;k++){
				  var ischecked = "";
				  if ($(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')) {  ischecked = "checked";}
				  ans = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
				  if (ans == null){ans = "";}
                  	html_String += '<div class="wrapper-comp-setting"><label class="label setting-label">Answer ' + k + '</label><input class="input setting-input answer-name" name="answer' + i  +'.' + j + '_' + k +'" id="answer' + i +'.' + j + '_' + k +'"  value="' + ans +'" type="text"><span class="tip setting-help"><input class="checkboxer" name="answer' + i  +'.' + j + '_cb" id="answer' + i  +'.' + j + '_' + k +'_cb" type="checkbox" '+ ischecked+'></span></div>';
				  
               }
            }
			html_String += '</div>';
			lo_url = $(element).find('input[name=lo' + i + '_link]').val();
            lo_name = $(element).find('input[name=lo' + i + '_name]').val();
			if (lo_url==null) {lo_url="";}
			if (lo_name==null) {lo_name="";}
			html_String += '<div class="wrapper-comp-setting"><label class="label setting-label">Learning Object Url</label><input class="input setting-input lo-link" name="lo'+ i + '_link" id="lo'+i+'_link" value="'+lo_url+'" 		type="text"><span class="tip setting-help">Example:"vbv454564sssd65321ssdsad"</span></div><div class="wrapper-comp-setting"><label class="label setting-label">Learning Object Name</label><input class="input setting-input lo-name" name="lo'+i+'_name" id="lo'+i+'_name" value="'+lo_name+'" type="text"><span class="tip setting-help">Example: "Multipler"</span></div>'
			html_String += '</div></li>'
        }
		var toggle_list = [];
		for (var i=1;i<=nGroups;i++){
			if ($(element).find('#' + i).html()=='+'){
				toggle_list.push(i)
			}
		}
        $("#panel2", element).html(html_String);
		for (var i=0;i<toggle_list.length;i++){
			$(element).find('#' + toggle_list[i]).html("+");
			$("#question-group-" + toggle_list[i]).slideToggle();
		}
    }

    $(function () {
        /* Here's where you'd do things on page load. */
    });
}
