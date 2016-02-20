"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from django.template import Template, Context
from xblock.core import XBlock
from xblock.fields import Scope, String, Dict, List, Boolean, Integer
from xblock.fragment import Fragment


class MyXBlock(XBlock):
 
    """
    THIS SECTION DESCRIBE WHAT XBLOCK "FIELD" IS
    YOU CAN CONSIDER FIELD AS DATABASE
    EACH FIELD REPRESENT A DATA YOU WANT TO STORE IN YOUR XBLOCK
    FOR EXAMPLE, THOSE 3 FIELDS BELOW ARE DATAS FOR XBLOCK'S VIDEOPLAYER
   
    href = String(help="URL of the video page at the provider",
        default=None, scope=Scope.content)
    maxwidth = Integer(help="Maximum width of the video", default=800,
        scope=Scope.content)
    maxheight = Integer(help="Maximum height of the video", default=450,
        scope=Scope.content)
    
    YOU CAN SEE THAT EACH FIELD CONSISTED OF 3 PARAMETERS:

    help: A help string for the field that can be used in an application such as edX Studio.

    default: The default value for the field.

    scope: The scope of the field. can be defined to explain a relationship between user and the data
    For example: "same to all user","different by each user","not relate to any user". For more Information READ THE DOC

    IN THIS STAGE I WILL ONLY NAME NECESSARY FIELD FOR FUTURE USE, YOU CAN ADD OR DELETE ANY FIELD AS YOU LIKE
    """
    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    """
    # FOR BASE XBLOCK
    class_unit #to be used for node in learning path
    is_pre_tested #check if student get pre-test
    is_post_tested # check if student get post-test
    is_pre_pass # check if student pass pre test
    is_post_pass # check if student pass post test
    private_results = Boolean(default=False, help="Whether or not to display results to the user.")
    """
    # FOR QUESTION XBLOCK
    questions = List(
        default=[
            (('1', {'0': 'How old are you', '1': 'How young are you','2': 'How fat are you', '3': 'How small are you' },
	      {'0': ['10','11','12','13'],'1': ['5','4','2','3'],'2': ['50','51','52','53'],'3': ['120','130','140','150']}
	    )),
            (('2',{'0': 'Do you know math', '1': 'Do you know algrebra','2': 'Do you know English', '3': 'Do you know human language'},
	     {'0': ['yes','maybe','no','why?'],'1': ['yes','maybe','no','why?'],'2': ['yes','maybe','no','why?'],'3':['yes','maybe','no','why?']}
	    )),
            (('3',{'0': 'Can you calculate', '1': 'Can you Multiple','2': 'Can you subtract', '3': 'Can you count' },
	     {'0': ['yes','Of course','What','why?'],'1': ['yes','maybe','no','why?'],'2': ['yes','maybe','no','why?'],'3':['yes','maybe','no','why?']}
	    ))
        ],
        scope=Scope.settings, help="Questions and Answers list for each test"
    )
    answers = List(
	default=[
		['13','2','51','140'],
		['yes','yes','yes','yes'],
		['What','yes','yes','yes']
	],
	scope=Scope.user_state, help="Correct answers for the questions"
    )
    choice = String(scope=Scope.settings, help="The student's answer")
    learning_object_url = String(help="Url of the learning object you want the student to learn", scope=Scope.content)
    # child_question, if student answer wrong, provide specific child question for student to answer next.
    """
     END OF FIELD SECTION.
    """
    
    # DEFAULT FUNCTION TO RETRIEVE RESOURCE : DO NOT EDIT!
    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")
    """
    STUDENT VIEW SECTION
    """
    # STUDENT VIEW, LOAD ALL FRONT-END OR NECESSARY FILES AND SEND TO THE USER.+
    def student_view(self, context=None):
        """
        The primary view of the MyXBlock, shown to students
        when viewing courses.
        """
	if not context:
            context = {}

	context.update({
            'questions': self.questions
        })
	html = Template(
            self.resource_string("static/html/myxblock.html")).render(Context(context))
        frag = Fragment(html)
	# LOAD CSS
        frag.add_css(self.resource_string("static/css/myxblock.css"))
	# LOAD JS
        frag.add_javascript(self.resource_string("static/js/src/myxblock.js"))
	# CREATE XBLOCK
        frag.initialize_js('MyXBlock')
        return frag
	

    """
    END OF STUDENT VIEW SECTION
    """
    

    """
    SELF-DEFINED FUNCTION, FOR AJAX OR ANY
    """
    
    # CHECK ANSWER FROM XBLOCK'S DATABASE AND RETURN THE RESULT
    @XBlock.json_handler
    def get_answer(self, data, suffix=''):
        
	result = {}
        for question,answer in data.items():
	    for key1 in range(0,len(self.questions)):	        		        
		for key2 in range(0,4):
                    temp = str(key2);
		    if self.questions[key1][1][temp] == question:
		        if self.answers[key1][key2] == answer:
			    result[question] = 'true'
	
                        else:
			    result[question] = 'false'
			break
	return {
            'Results': result
        }

    """
    END OF SELF-DEFINED FUNCTION
    """

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    # USED IN XBLOCK-SDK
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("MyXBlock",
             """<myxblock/>
             """),
            ("Multiple MyXBlock",
             """<vertical_demo>
                <myxblock/>
                <myxblock/>
                <myxblock/>
                </vertical_demo>
             """),
        ]
