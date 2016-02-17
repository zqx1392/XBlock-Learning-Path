"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer
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
    
    # FOR BASE XBLOCK
    class_unit #to be used for node in learning path
    is_pre_tested #check if student get pre-test
    is_post_tested # check if student get post-test
    is_pre_pass # check if student pass pre test
    is_post_pass # check if student pass post test

    # FOR QUESTION XBLOCK
    question
    answer_list
    correct_answer
    learning_object_link # to link to specific learning object in case student answer wrong
    child_question # if student answer wrong, provide specific child question for student to answer next.
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
	# LOAD HTML
        html = self.resource_string("static/html/myxblock.html")
        frag = Fragment(html.format(self=self))
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
    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}
    
    # CHECK ANSWER FROM XBLOCK'S DATABASE AND RETURN THE RESULT
    @XBlock.json_handler
    def get_answer(self, data, suffix=''):
        return null

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
