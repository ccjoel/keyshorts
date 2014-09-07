"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

#from django.utils.datetime_safe import datetime
from django.test import TestCase
from django.core.urlresolvers import reverse
from keyboard.keyboard_input.models import *
from keyboard.keyboard_input.forms import *
import re
#from django.test import Client


#class SimpleTest(object):
#    def test_basic_addition(self):
#        """
#        Tests that 1 + 1 always equals 2.
#        """
#        self.assertEqual(1 + 1, 2)
#
#    def our_time(self):
#        print datetime.now()
#
#a = SimpleTest()


class ProgramProfileViewTestCase(TestCase):
    def test_index(self):
#        program_1 = Program.objects.create(
#            id='1',
#            name='Joels Program',
#            desc='no desc available for now',
#            version = '2.0.2',
#            image_url='http://helloworld.com/image.jpg'
#        )
#        response = self.client.get('/programs/add/')
        response = self.client.get('/programs/profile/1')
        
#        print response
#        print response.status_code
#        print response.context
        print re.match('[a-zA-Z]', '')

        self.assertEqual(response.status_code, 200)
        

#class ProgramSearchTestCase(TestCase):
#    def test_index(self):
#        response = self.client.get('/programs/search/')
#        self.assertEqual(response.status_code, 200)

#import inspect
#for property in inspect.getmembers(SimpleTest, predicate=inspect.ismethod):
#    print property[0]