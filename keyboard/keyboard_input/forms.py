from django.forms.widgets import Textarea
from django.forms.widgets import Select
from django.forms.widgets import PasswordInput
from keyboard.keyboard_input.models import *
from django.forms.models import ModelForm
from django import forms
import re

class ProgramForm(ModelForm):
    class Meta:
        model = Program
        widgets = {
            'desc': Textarea(attrs={'cols': 20, 'rows': 5}),
        }
    def clean_name(self):
        data = self.cleaned_data['name']
        if re.match('[a-zA-Z ]*$', data) is None:
            raise forms.ValidationError("This name is not valid!")
        return data
    def clean_desc(self):
        data = self.cleaned_data['desc']
        if re.match('[a-zA-Z \.]*$', data) is None:
            raise forms.ValidationError("This desc is not valid!")
        return data
    def clean_version(self):
        data = self.cleaned_data['version']
        if re.match('[0-9\.]*$', data) is None:
            raise forms.ValidationError("This version is not valid!")
        return data
#    def clean_image_url(self):
#        data = self.cleaned_data['image_url']
#        if re.match('/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$', data) is None:
#            raise forms.ValidationError("This version is not valid!")
#        return data

class SchemeForm(ModelForm):
    class Meta:
        model = Scheme
        exclude = ('program')
        widgets = {
            'desc': Textarea(attrs={'cols': 20, 'rows': 5}),
            'user': forms.Select(),
        }


class KeyboardForm(ModelForm):
    required_css_class = 'required'
    class Meta:
        model = Shortcut
        exclude = ('scheme')
        widgets = {
            'desc': Textarea(attrs={'cols': 20, 'rows': 5}),
        }


class SearchProgramForm(forms.Form):
    program_search = forms.CharField(max_length=40)
    def __init__(self, *args, **kwargs):
        super(SearchProgramForm, self).__init__(*args, **kwargs)
        self.fields['program_search'].label = ""


class LogInForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(widget=PasswordInput, max_length=20)