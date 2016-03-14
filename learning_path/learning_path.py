"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from django.template import Template, Context
from xblock.core import XBlock
from xblock.fields import Scope, String, Dict, List, Boolean, Integer
from xblock.fragment import Fragment

from django import template
from django.utils.datastructures import OrderedDict

class BasePathBlock(XBlock):

	# Fields are defined on the class.  You can access them in your code as
	# self.<fieldname>.

	temperVar = String(scope=Scope.preferences, default="")
	#record current LO test a student taking.
	current_lo_links = List(scope=Scope.user_info,default=[""])
	current_lo_name = String(scope=Scope.preferences,default="")


	# DEFAULT FUNCTION TO RETRIEVE RESOURCE : DO NOT EDIT!
	def resource_string(self, path):
		"""Handy helper for getting resources from our kit."""
		data = pkg_resources.resource_string(__name__, path)
		return data.decode("utf8")



class QuestionBlock(BasePathBlock):
	# FOR QUESTION XBLOCK
	# question : its format is (('question_number',
	#							{'subquestion_number_1':'question_content_1','subquestion_number_2':'question_content_2',...},
	#							{'subanswer_number_1':['answer_1','answer_2','answer_3','answer_4'],'subanswer_number_2':['answer_1','answer_2','answer_3','answer_4'],...}
	#							))
	display_name = String(default="Learning Path Test",scope=Scope.settings)
	test_title = String(scope=Scope.settings, default="Division",help="Title of the test")
	total_question = Integer (default=3,scope=Scope.settings, help="Number of questions")
	questions = List(
		default=[
            (['1', {'1': 'How old are you', '2': 'How young are you','3': 'How fat are you', '4': 'How small are you' },
	      {'1': ['10','11','12','13'],'2': ['5','4','2','3'],'3': ['50','51','52','53'],'4': ['120','130','140','150']}
	    ]),
            (['2',{'1': 'Do you know math', '2': 'Do you know algrebra','3': 'Do you know English', '4': 'Do you know human language'},
	     {'1': ['yes','maybe','no','why?'],'2': ['yes','maybe','no','why?'],'3': ['yes','maybe','no','why?'],'4':['yes','maybe','no','why?']}
	    ]),
            (['3',{'1': 'Can you calculate', '2': 'Can you Multiple','3': 'Can you subtract', '4': 'Can you count' },
	     {'1': ['yes','Of course','What','why?'],'2': ['yes','maybe','no','why?'],'3': ['yes','maybe','no','why?'],'4':['yes','maybe','no','why?']}
	    ])
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
		scope=Scope.settings, help="Correct answers for the questions"
    	)
	choices = List(
		default=[
				['','','',''],
				['','','',''],
				['','','','']
			],
		scope=Scope.user_state, help="The student's answer")
	learning_object_url = List(
		default=[
				"linkA","linkB","linkC"
			],
		help="Url of the learning object you want students to learn", scope=Scope.settings)
	learning_object_name = List(
		default=[
			"How to be Mark","How to mark","Mark Mark"
			],
		help="Name of the learning object you want students to learn", scope=Scope.settings)
	test_status = String(default="untake",scope=Scope.settings, help="Status of the test, it can be untake, taking, took")
	test_type = String(default="pre",scope=Scope.content, help="Type of the test, it can be pre,post, and quiz")
	
	has_score = True

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
			'test_title' : self.test_title,
			'questions': self.questions,
			'total_question' : self.total_question,
			'correct_icon' : correct_icon_path,
			'incorrect_icon' : incorrect_icon_path,
		})
		html = Template(
			self.resource_string("public/html/question.html")).render(Context(context)
		)
		frag = Fragment(html)
	# LOAD CSS
		frag.add_css(self.resource_string("public/css/question.css"))
	# LOAD JS
		frag.add_javascript(self.resource_string("public/js/src/question.js"))
	# CREATE XBLOCK
		frag.initialize_js('QuestionBlock')
		return frag
	"""
	END OF STUDENT VIEW SECTION
	"""
	def studio_view(self, context=None):
		if not context:
			context = {}

		#Define variable to be used in HTML Template
		context.update({
			'test_title' : self.test_title,
			'questions': self.questions,
			'total_question' : self.total_question,
			'answers' : self.answers,
			'learning_object_url' : self.learning_object_url,
			'learning_object_name' : self.learning_object_name,
			'test_type' : self.test_type,
		})
		html = Template(
			self.resource_string("public/html/question_edit.html")).render(Context(context)
		)
		frag = Fragment(html)
	# LOAD CSS
		frag.add_css(self.resource_string("public/css/question_edit.css"))
	# LOAD JS
		frag.add_javascript(self.resource_string("public/js/src/question_edit.js"))
	# CREATE XBLOCK
		frag.initialize_js('QuestionEditBlock')
		return frag


	"""
	SELF-DEFINED FUNCTION, FOR AJAX OR ANY
	"""
	def submit_grade(self, data, suffix=''):
		self.runtime.publish(self, "grade",
                    { value: 5.0,
                      max_value: 10.0 })

	# load previous student choice
	@XBlock.json_handler
	def load_choice(self, data, suffix=''):
		#Define user previous choice for html page
		result = {}
		for key1 in range(0,len(self.choices)):
			for key2 in range(0,len(self.choices[key1])):
				question_num = key1 + 1
				temp = key2 + 1
				if self.choices[key1][key2] == self.answers[key1][key2]:
					result[str(question_num) + '.' + str(temp)] = { 'result':'true', 'choice':self.choices[key1][key2]}
				else:
					result[str(question_num) + '.' + str(temp)] = { 'result':'false','choice':self.choices[key1][key2] }
		return {
			'choices' : result
		}

	# CHECK ANSWER FROM XBLOCK'S DATABASE AND RETURN THE RESULT in form {'question_number': {'sub_question_number':'result(true or false)'}}
	@XBlock.json_handler
	def get_answer(self, data, suffix=''):
		result = {}
		sub_q_count = 0
		for question,answer in data.items():
			for key1 in range(0,len(self.questions)):
				for key2 in range(1,len(self.questions[key1][1])+1):
					temp = str(key2)
					if self.questions[key1][1][temp] == question:
						question_num = key1 + 1
						if self.answers[key1][key2-1] == answer:
							result[question_num] = { temp:'true'}
						else:
							result[question_num] = { temp:'false'}
						sub_q_count = len(self.answers[key1])
						if len(self.choices) == key1 or len(self.choices) == 0 :
							self.choices.append([])
						if len(self.choices[key1]) == key2-1 or len(self.choices[key1]) == 0 :
							self.choices[key1].append('') 
						self.choices[key1][key2-1] = answer
						break
		return {
			'Results': result,
			'sub_question_count' : sub_q_count,
			'choices' : self.choices
		}	
	# EDIT QUESTION
	@XBlock.json_handler
	def edit_questions(self, data, suffix=''):
		self.test_title = data['display_name']
		self.test_type = data['test_type']
		self.total_question = data['total_question']
		self.questions = data['questions']
		self.answers = data['answers']
		self.learning_object_url = data['learning_object_url']
		self.learning_object_name = data['learning_object_name']
		return {
			'result' : 'success' 
		}

	# GET LEARNING OBJECT LINK AND NAME WHEN A STUDENT ANSWERS ALL QUESTIONS
	@XBlock.json_handler
	def get_lo(self, data, suffix=''):
		uniqueId = unicode(self.scope_ids.usage_id)
		uniqueId = uniqueId.split("@")
		uniqueId = uniqueId[-1]
		self.current_lo_links.insert(0,uniqueId)
		"""
		self.runtime.publish(self, "grade",
                    { 'value': 5.0,
                      'max_value': 10.0 })
		"""
		num = 0
		for head,number in data.items():
			num = int(number)-1
		self.choices = []
		return {
			'learning_object_url' : self.learning_object_url[num],
			'learning_object_name' : self.learning_object_name[num],
			'lo_link' : self.current_lo_links[0]
		}
	@XBlock.json_handler
	def pass_test(self, data, suffix=''):
		uniqueId = unicode(self.scope_ids.usage_id)
		uniqueId = uniqueId.split("@")
		uniqueId = uniqueId[-1]
		if uniqueId in self.current_lo_links:
			self.current_lo_links.remove(uniqueId)
		return {
			'result' : 'success'
		} 

	"""
	END OF SELF-DEFINED FUNCTION
	"""

	@staticmethod
	def workbench_scenarios():
		"""A canned scenario for display in the workbench."""
		return [
			("MyXBlock",
			 """<vertical_demo>
				<question/>
				<link/>
				</vertical_demo>
			 """),
			("Multiple MyXBlock",
			 """<vertical_demo>
				<question/>
				<question/>
				<question/>
				</vertical_demo>
			"""),
		]

class LinkBlock(BasePathBlock):
	"""
	STUDENT VIEW SECTION
	"""
	display_name = String(default="Learning Path Link",scope=Scope.settings)
	# STUDENT VIEW, LOAD ALL FRONT-END OR NECESSARY FILES AND SEND TO THE USER.
	def student_view(self, context=None):
		if not context:
			context = {}
		#Define variable to be used in HTML Template
		context.update({
			'lo_link' : self.current_lo_links[0],
			'lo_name' : self.current_lo_name
		})
		html = Template(
			self.resource_string("public/html/link.html")).render(Context(context)
		)
		frag = Fragment(html)
	# LOAD CSS
		frag.add_css(self.resource_string("public/css/link.css"))
	# LOAD JS
		frag.add_javascript(self.resource_string("public/js/src/link.js"))
	# CREATE XBLOCK
		frag.initialize_js('LinkBlock')
		return frag
	"""
	END OF STUDENT VIEW SECTION
	"""

	@staticmethod
	def workbench_scenarios():
		"""A canned scenario for display in the workbench."""
		return [
			("Linker",
			 """<vertical_demo>
				<link/>
				</vertical_demo>
			 """)
		]
