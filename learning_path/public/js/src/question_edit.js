function QuestionEditBlock(runtime, element) {

	/* Click event for Cancel button, while in the edit mode */
	$(element).find('.cancel-button').bind('click', function() {	
		$(document).off('click', 'input:checkbox');
		$(element).find('.save-button').unbind();
		$(document).off('click','.min-max-button');
		$(document).off('change','.edit_sub_number');
		$(element).off('change', '#edit_total_question');

		runtime.notify('cancel', {});
	});
	//check input's number whether a positive integer.
	function isPositiveInteger(s)
	{
		var i = +s; // convert to a number
		if (i <= 0) return false; // make sure it's positive
		if (i != ~~i) return false; // make sure there's no decimal part
		return true;
	}

	//check user input before send to server. (input all neccesary details)
	function checkUserInput(){
		//check if title name is inputted
		if (!$(element).find('input[id=edit_title_name]').val()){
			alert ("Please input the test's title name");		
			return false;
		}
		//check if test type is selected
		if (!$('#edit_test_type').val()){
			alert ("Please choose the test type");		
			return false;
		}
		//check if total question number is inputted correctly
		if ( isNaN($(element).find('input[id=edit_total_question]').val()) || !isPositiveInteger($(element).find('input[id=edit_total_question]').val()) ){
			alert ("Please input correct number in total main question number");		
			return false;
		}
		//check in each question set...
		nGroups = $(element).find('input[id=edit_total_question]').val();
		for (var i=1;i<=nGroups;i++){
			//check if sub question number is inputted correctly
			if (isNaN($(element).find('input[id=edit_total_sub_question_' + i + ']').val()) || !isPositiveInteger($(element).find('input[id=edit_total_sub_question_' + i + ']').val()) ){
				alert ("Please input correct number in total sub question number for Q" + i);
				return false;
			}
			//check in each question...
			var total_sub_question = $(element).find('input[id=edit_total_sub_question_' + i + ']').val();
			for (var j=1;j<=total_sub_question;j++){
				//check question content or picture is inputted
				if (!$(element).find('input[name=question' + i + '\\.'+ j + ']').val() && !$(element).find('input[name=question' + i + '\\.'+ j + '_pic]').val()){
					alert ("Please input a question content or picture on Q" + i + "." + j);
					return false;				
				}
				//check learning object link and name are inputted.
				if (!$(element).find('input[name=lo' + i + '\\.' + j + '_link]').val() && $(element).find('input[name=lo' + i + '\\.' + j + '_link]').length > 0){
					if (j==1) {}
					else {
						alert ("Please input learning object link for Q" + i + '.' + j);
						return false;
					}
				}
				
				if (!$(element).find('input[name=lo' + i + '\\.' + j + '_name]').val() && $(element).find('input[name=lo' + i + '\\.' + j + '_name]').length > 0){
					if (j==1) {}
					else {
						alert ("Please input learning object name for Q" + i + '.' + j);
						return false;
					}
				}
				//variable to check for checkbox (correct answer)
				var isChecked = false;	
				//check for each answer...
				for (var k=1;k<=4;k++){
					//check answer content is inputted
					if (!$(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val()){
						alert ("Please input an answer for Q" + i + "." + j);
						return false;
					}
					//check if one of checkboxes is selected 
					if ( $(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')){
						isChecked = true;
					}
				}
				//if no checkbox is selected
				if (!isChecked){
					alert ("Please select one correct answer in Q" + i +  "." + j);
					return false;
				}
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
        var questions = [];
        var answers = [];
        var learning_object_url = [];
        var learning_object_name = [];
		//total question set
        var nGroups = $(element).find('input[id=edit_total_question]').val();

		for (var i=1;i<=nGroups;i++){
			//make new array for each row
            questions.push([String(i)]);
            answers.push([]);
			learning_object_url.push([]);
			learning_object_name.push([]);
			//temporary variables to store dict value.
            var temp_questions = {};
            var temp_answers = {};
			var temp_pictures = {};
			//total sub question number
			var total_sub_question = $(element).find('input[id=edit_total_sub_question_' + i + ']').val();
            for (var j=1;j<=total_sub_question;j++){
				//get value from user input
				var question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
				temp_questions[String(j)] = question_name;
				var picture = $(element).find('input[name=question' + i + '\\.'+ j + '_pic]').val();
				if (picture == undefined) picture ="";
				temp_pictures[String(j)] = picture;
				var lo_url = $(element).find('input[name=lo' + i + '\\.' + j + '_link]').val();
				var lo_name = $(element).find('input[name=lo' + i + '\\.' + j + '_name]').val();
				if (lo_url == undefined) lo_url = "";
				if (lo_name == undefined) lo_name = "";
				learning_object_url[i-1].push(lo_url);
				learning_object_name[i-1].push(lo_name);
				//get value from each answer
				var temp_sub_answer = [];
				for (var k=1;k<=4;k++){
					var answer = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
					temp_sub_answer.push(answer);	
					if ( $(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')){
						answers[i-1].push(answer);
					}
				}
				temp_answers[String(j)] = temp_sub_answer;
			}
			questions[i-1].push(temp_questions);
			questions[i-1].push(temp_answers);
			questions[i-1].push(temp_pictures);
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

	// minimize questions
	$(document).on('click','.min-max-button',function(){
		var num = $(this).attr("id");
		//minimize individual question
		if (num.indexOf('.') > -1){
			num = num.split('.');
			if($(this).html() == "-"){
				$(this).html("+");
				$("#QS" + num[0] +'\\.' + num[1]).slideUp(350);
			}
			else{
		//		$(this).parent().parent().find('.question-set').slideUp(350);
				$(this).html("-");
				$("#QS" + num[0] +'\\.' + num[1]).slideDown(350);
			}
		}
		//minimize question set
		else {
			if($(this).html() == "-"){
				$(this).html("+");

				$("#question-group-" + num).slideUp(350);
			}
			else{
        		$(this).parent().parent().find('.question-set').slideUp(350);
				$(this).html("-");

				$("#question-group-" + num).slideDown(350);
			}
			
		}	
	});


	/* Dynamically recreates html text inputs for sub question number in case user chooses to interact with the control using up and down buttons */
	$(document).on('change','.edit_sub_number',function(){
		var question_num = $(this).val();
		if (question_num>=1){
			GenerateDynamicSubQuestions(element,this);
		}
	});

    /* Dynamically recreates html text inputs for main question number in case user chooses to interact with the control using up and down buttons */
    $(element).on('change', '#edit_total_question', function(){
        var question_num = $(this).val();
		if (question_num>=1){
        	GenerateDynamicInputs(element, this);
		}
    });



	function GenerateDynamicSubQuestions(element, groupElement){
		var id_string = $(groupElement).attr("id");
		var i = id_string.substring(24,id_string.length);
		var html_String = "";
		var total_sub = parseInt($(groupElement).val());
		for (var j=1;j<=total_sub;j++){
			var question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
			if (question_name == null){question_name = "";}
			var picture_link = $(element).find('input[name=question' + i + '\\.'+ j + '_pic]').val();
			if (picture_link == null){picture_link = "";}
			html_String += '<div id="Q'+i+'.'+j+'">';
			html_String += '<div class="wrapper-comp-setting">';
			//question label
			html_String += '<label class="label setting-label">Q' + i + '.' + j +' Question</label>';
			//question content input
			html_String += '<input class="input setting-input question-name" name="question' + i + '.' + j +'" id="question' + i + '.' + j +'" value="' + question_name + '" type="text">';
			//minimize buton					
			html_String += '<div class="min-max-button" id="'+i+'.'+j+'">-</div>';
			html_String += '</div>';

			//picture part + to be minimized part
			html_String += '<div id="QS'+i+'.'+j+'">';
			// picture
			html_String += '<div class="wrapper-comp-setting" >';
			html_String += '<label class="label setting-label">Q' + i + '.' + j +' Picture</label>';
			html_String += '<input class="input setting-input question-name" name="question' + i + '.' + j +'_pic" id="question' + i + '.' + j +'_pic"';
			html_String += 'value="' + picture_link + '" type="text">';
			html_String += '</div>';
			//answers
			for (var k=1;k<=4;k++){
				var ischecked = "";
				if ($(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')) {  ischecked = "checked";}
				var ans = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
				if (ans == null){ans = "";}
				html_String += '<div class="wrapper-comp-setting">';
				html_String += '<label class="label setting-label">Answer ' + k + '</label>';
				html_String += '<input class="input setting-input answer-name" name="answer' + i  +'.' + j + '_' + k +'" id="answer' + i +'.' + j + '_' + k +'"';
				html_String += 'value="' + ans +'" type="text">';
				html_String += '<span class="tip setting-help"><input class="checkboxer" name="answer' + i  +'.' + j + '_cb" id="answer' + i  +'.' + j + '_' + k +'_cb"';
				html_String += 'type="checkbox" '+ ischecked+'></span>';
				html_String += '</div>';	  
			}
			//learning object
			if ((total_sub >1 && j != 1) || total_sub == 1){
				var lo_url = $(element).find('input[name=lo' + i + '\\.' + j + '_link]').val();
				var lo_name = $(element).find('input[name=lo' + i + '\\.' + j + '_name]').val();
				if (lo_url == null) lo_url = "";
				if (lo_name == null) lo_name = "";
				//url
				html_String += '<div class="wrapper-comp-setting">';
				html_String += '<label class="label setting-label">Learning Object Url</label>';
				html_String += '<input class="input setting-input lo-link" name="lo'+i+'.'+j+'_link"';
				html_String += 'id="lo'+i+'.'+j+'_link" value="'+lo_url+'" type="text">';
				html_String += '<span class="tip setting-help">Example:"vbv45ad59svsrtu81"</span>';
				html_String += '</div>';
				//name
				html_String += '<div class="wrapper-comp-setting">';
				html_String += '<label class="label setting-label">Learning Object Name</label>';
				html_String += '<input class="input setting-input lo-name" name="lo'+i+'.'+j+'_name"';
				html_String += 'id="lo'+i+'.'+j+'_name" value="'+lo_name+'" type="text">';
				html_String += '<span class="tip setting-help">Example: "Multipler"</span>';
				html_String += '</div>';
			}
			html_String += '</div>';
			html_String += '</div>';
		}
		var toggle_sub_list = [];
		var total_sub = $(element).find('input[id=edit_total_sub_question_'+i+']').val();
		for (var j=1;j<=total_sub;j++){
			if ($(element).find('#' + i + '\\.' + j).html()=='+'){
				toggle_sub_list.push([i,j]);
			}	
		}
        $("#question-group-"+i+"", element).html(html_String);
		for (var i=0;i<toggle_sub_list.length;i++){
			$(element).find('#' + toggle_sub_list[i][0] + '\\.' + toggle_sub_list[i][1]).html("+");
			$("#QS" + toggle_sub_list[i][0] +'\\.' + toggle_sub_list[i][1]).slideUp(0);
		}

		
		
	}
	/* Generates label and inputs for each group, depending on the entered number of available groups */
	function GenerateDynamicInputs(element, groupElement) {
		var nGroups = $(groupElement).val();
		var html_String = "";
		for (var i=1;i<=nGroups;i++){
			var total_sub = $(element).find('input[id=edit_total_sub_question_'+i+']').val();
			if (total_sub == null) total_sub = 1;
			total_sub = parseInt(total_sub);
			html_String += '<li class="field comp-setting-entry is-set">';
			html_String += '<div class="wrapper-comp-setting">';
			html_String += '<label class="label setting-label">Q'+i+': Total question</label>';
			html_String += '<input class="input setting-input edit_sub_number" id="edit_total_sub_question_'+i+'" value="'+total_sub+'" type="number" >';
			html_String += '<div class="min-max-button" id="'+i+'">-</div>';
			html_String += '</div>';
			html_String += '<div class="question-set" id = "question-group-'+i+'">';
			for (var j=1;j<=total_sub;j++){
				var question_name = $(element).find('input[name=question' + i + '\\.'+ j + ']').val();
				if (question_name == null){question_name = "";}
				var picture_link = $(element).find('input[name=question' + i + '\\.'+ j + '_pic]').val();
				if (picture_link == null){picture_link = "";}
				html_String += '<div id="Q'+i+'.'+j+'">';
				html_String += '<div class="wrapper-comp-setting">';
				//question label
				html_String += '<label class="label setting-label">Q' + i + '.' + j +' Question</label>';
				//question content input
				html_String += '<input class="input setting-input question-name" name="question' + i + '.' + j +'" id="question' + i + '.' + j +'" value="' + question_name + '" type="text">';
				//minimize buton					
				html_String += '<div class="min-max-button" id="'+i+'.'+j+'">-</div>';
				html_String += '</div>';

				//picture part + to be minimized part
				html_String += '<div id="QS'+i+'.'+j+'">';
				// picture
				html_String += '<div class="wrapper-comp-setting" >';
				html_String += '<label class="label setting-label">Q' + i + '.' + j +' Picture</label>';
				html_String += '<input class="input setting-input question-name" name="question' + i + '.' + j +'_pic" id="question' + i + '.' + j +'_pic"';
				html_String += 'value="' + picture_link + '" type="text">';
				html_String += '</div>';
				//answers
				for (var k=1;k<=4;k++){
					var ischecked = "";
					if ($(element).find('input[id=answer' + i + '\\.'+ j + '_'+ k + '_cb]').is(':checked')) {  ischecked = "checked";}
					var ans = $(element).find('input[name=answer' + i + '\\.'+ j + '_'+ k + ']').val();
					if (ans == null){ans = "";}
					html_String += '<div class="wrapper-comp-setting">';
					html_String += '<label class="label setting-label">Answer ' + k + '</label>';
					html_String += '<input class="input setting-input answer-name" name="answer' + i  +'.' + j + '_' + k +'" id="answer' + i +'.' + j + '_' + k +'"';
					html_String += 'value="' + ans +'" type="text">';
					html_String += '<span class="tip setting-help"><input class="checkboxer" name="answer' + i  +'.' + j + '_cb" id="answer' + i  +'.' + j + '_' + k +'_cb"';
					html_String += 'type="checkbox" '+ ischecked+'></span>';
					html_String += '</div>';	  
				}
				//learning object
				if ((total_sub >1 && j != 1) || total_sub == 1){
					var lo_url = $(element).find('input[name=lo' + i + '\\.' + j + '_link]').val();
					var lo_name = $(element).find('input[name=lo' + i + '\\.' + j + '_name]').val();
					if (lo_url == null) lo_url = "";
					if (lo_name == null) lo_name = "";
					//url
					html_String += '<div class="wrapper-comp-setting">';
					html_String += '<label class="label setting-label">Learning Object Url</label>';
					html_String += '<input class="input setting-input lo-link" name="lo'+i+'.'+j+'_link"';
					html_String += 'id="lo'+i+'.'+j+'_link" value="'+lo_url+'" type="text">';
					html_String += '<span class="tip setting-help">Example:"vbv45ad59svsrtu81"</span>';
					html_String += '</div>';
					//name
					html_String += '<div class="wrapper-comp-setting">';
					html_String += '<label class="label setting-label">Learning Object Name</label>';
					html_String += '<input class="input setting-input lo-name" name="lo'+i+'.'+j+'_name"';
					html_String += 'id="lo'+i+'.'+j+'_name" value="'+lo_name+'" type="text">';
					html_String += '<span class="tip setting-help">Example: "Multipler"</span>';
					html_String += '</div>';
					
				}
				html_String += '</div>';
				html_String += '</div>';
			}
			html_String += '</div></li>'
        }
		var toggle_list = [];
		var toggle_sub_list = [];
		for (var i=1;i<=nGroups;i++){
			if ($(element).find('#' + i).html()=='+'){
				toggle_list.push(i)
			}
			var total_sub = $(element).find('input[id=edit_total_sub_question_'+i+']').val();
			for (var j=1;j<=total_sub;j++){
				if ($(element).find('#' + i + '\\.' + j).html()=='+'){
					toggle_sub_list.push([i,j]);
				}	
			}
		}
        $("#panel2", element).html(html_String);
		for (var i=0;i<toggle_sub_list.length;i++){
			$(element).find('#' + toggle_sub_list[i][0] + '\\.' + toggle_sub_list[i][1]).html("+");
			$("#QS" + toggle_sub_list[i][0] +'\\.' + toggle_sub_list[i][1]).slideUp(0);
		}
		for (var i=0;i<toggle_list.length;i++){
			$(element).find('#' + toggle_list[i]).html("+");
			$("#question-group-" + toggle_list[i]).slideUp(0);
		}
		
    }

    $(function () {
        /* Here's where you'd do things on page load. */
		 nGroups = $(element).find('input[id=edit_total_question]').val();

		for (var i=1;i<=nGroups;i++){
			var total_sub_question = $(element).find('input[id=edit_total_sub_question_' + i + ']').val();
			$("#question-group-" + i).slideUp(350);
            for (var j=1;j<=total_sub_question;j++){
				$('#Q' + i + '\\.' + j, element).appendTo("#question-group-" + i);	
				$("#QS" + i +'\\.' + j).slideUp(350);		
			}
		}
    });
}
