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
	# question : its format is (('question_number',
	#							{'subquestion_number_1':'question_content_1','subquestion_number_2':'question_content_2',...},
	#							{'subanswer_number_1':['answer_1','answer_2','answer_3','answer_4'],'subanswer_number_2':['answer_1','answer_2','answer_3','answer_4'],...}
	#							))
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
	# answer : get value directly from questions list and record correct answers
	answers = List(
		default=[
				['13','2','51','140'],
				['yes','yes','yes','yes'],
				['What','yes','yes','yes']
			],
		scope=Scope.user_state, help="Correct answers for the questions"
    	)
	choices = List(
		default=[
				['','','',''],
				['','','',''],
				['','','','']
			],
		scope=Scope.settings, help="The student's answer")
	learning_object_url = String(
		default=[
				"linkA","linkB","linkC"
			],
		help="Url of the learning object you want students to learn", scope=Scope.settings)
	learning_object_name = List(
		default=[
			"How to be Mark","How to mark","Mark Mark"
			],
		help="Name of the learning object you want students to learn", scope=Scope.settings)
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
	# STUDENT VIEW, LOAD ALL FRONT-END OR NECESSARY FILES AND SEND TO THE USER.
	def student_view(self, context=None):
		"""
		The primary view of the MyXBlock, shown to students
		when viewing courses.
		"""
		if not context:
			context = {}
		#Define path for images to be used on html template
		correct_icon_path=self.runtime.local_resource_url(self, 'public/imgs/correct-icon.png')
		incorrect_icon_path=self.runtime.local_resource_url(self, 'public/imgs/incorrect-icon.png')
		#Define variable to be used in HTML Template
		context.update({
			'questions': self.questions,
			'choices' : self.choices,
			'learning_object_url' : self.learning_object_url,
			'learning_object_name' : self.learning_object_name,
			'correct_icon' : correct_icon_path,
			'incorrect_icon' : incorrect_icon_path
		})
		html = Template(
			self.resource_string("public/html/myxblock.html")).render(Context(context)
		)
		frag = Fragment(html)
	# LOAD CSS
		frag.add_css(self.resource_string("public/css/myxblock.css"))
	# LOAD JS
		frag.add_javascript(self.resource_string("public/js/src/myxblock.js"))
	# CREATE XBLOCK
		frag.initialize_js('MyXBlock')
		return frag


	"""
	END OF STUDENT VIEW SECTION
	"""
	def studio_view(self, context=None):
		 """
		The primary view of the MyXBlock, shown to teachers
		when editing the block.
		"""
		html_edit_xblock = self.resource_string("static/html/myxblock_edit.html")
		template = Template(html_edit_xblock)
		
		#merge group names and group values for easier iteration in Django template
		#groups = [[name, value] for name, value in zip(self.groupNames, self.groupValues)]
		
		#parameters sent to browser for edit html page
		html = template.render(Context({
			'questions': self.questions,
			'answers': self.answers,
			'learning_object_url' : self.learning_object_url
			}))
		
		frag = Fragment(html.format(self=self))
		#adding references to external css and js files
		frag.add_css(self.resource_string("static/css/myxblock_edit.css"))
		frag.add_javascript(self.resource_string("static/js/src/myxblock_edit.js"))
		frag.initialize_js('MyXBlockEdit')
		return frag

	"""
	SELF-DEFINED FUNCTION, FOR AJAX OR ANY
	"""

	# CHECK ANSWER FROM XBLOCK'S DATABASE AND RETURN THE RESULT in form {'question_number': {'sub_question_number':'result(true or false)'}}
	@XBlock.json_handler
	def get_answer(self, data, suffix=''):    
		result = {}
		for question,answer in data.items():
			for key1 in range(0,len(self.questions)):	        		        
				for key2 in range(0,4):
					temp = str(key2)
					if self.questions[key1][1][temp] == question:
						question_num = key1 + 1
						if self.answers[key1][key2] == answer:
							result[question_num] = { key2:'true'}
						else:
							result[question_num] = { key2:'false'}
						self.choices[key1][key2] == answer
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
