from django.http import QueryDict
from django.http import HttpResponse
from django.utils import simplejson
from keyboard.keyboard_input.models import *
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from keyboard.keyboard_input.forms import *
#from django.contrib.auth import authenticate
from django.core.context_processors import csrf


###############################
#
###### SHARED ######

def shared_app_data(request):
    return {
        'user': request.user,
        'loginForm': LogInForm(),
        'searchProgramForm' : SearchProgramForm(),
        'isAuth' : request.user.is_authenticated()
    }

def index(request):
    return render_to_response('index.html', context_instance=RequestContext(request, processors=[shared_app_data]))


################################
#
###### DATA RETRIEVAL ######

#decides if the search has one or more search results
def programSearch(request):
    if request.method == 'GET':
        if request.GET.get('program_search', ''):
            programs = Program.objects.filter(name__icontains=request.GET.get('program_search', ''))
            if len(programs) > 1:
                url = '/programs/results/'+request.GET.get('program_search', '')
                return HttpResponseRedirect(url)
            elif len(programs) == 1:
                url = '/programs/profile/'+str(programs[0].id)
                return HttpResponseRedirect(url)
    #else for all if's (no GET, no program_search, or length = 0)
    return HttpResponseRedirect('/programs/results/0')
#end programSearch


#show program search results
def programResults(request, name='none'):
    if request.method == 'GET':
        if not type(name) == 'int':
            programs = Program.objects.filter(name__icontains=name)
            if len(programs) > 1:
                return render_to_response('program_results.html', {'program_list' : programs}, context_instance=RequestContext(request, processors=[shared_app_data]))
            elif len(programs) == 1:
                url = '/programs/profile/'+str(programs[0].id)
                return HttpResponseRedirect(url)
    return render_to_response('program_results.html', {'error': 'No programs found with that name.','isLoggedIn' : request.user.is_authenticated()}, context_instance=RequestContext(request, processors=[shared_app_data]))
#end programResults

def browseAllPrograms(request, name='none'):
    programs = Program.objects.all()
    return render_to_response('program_results.html', {'program_list' : programs}, context_instance=RequestContext(request, processors=[shared_app_data]))

#view the program profile, which shows the different schemes and the default keyboard scheme
def programProfile(request, id):
    if request.method == 'GET':
        if id:
            try:
                programs = Program.objects.get(id=int(id))
            except:
                return render_to_response('program_results.html',{'error':'This program is not found. You can create your program.'}, context_instance=RequestContext(request, processors=[shared_app_data]))
            try:
                schemes = Scheme.objects.filter(program_id=programs.id)
                schemes_len = len(schemes)
                first_scheme = schemes[0]
                shortcuts = Shortcut.objects.filter(scheme_id=first_scheme.id)
                return render_to_response('program_profile.html', {'program':programs, 'schemes': schemes, 'schemes_len' : schemes_len, 'first_scheme' : first_scheme, 'shortcuts' : shortcuts}, context_instance=RequestContext(request, processors=[shared_app_data]))
            except:
                return render_to_response('program_profile.html',{'error':'This program does not have any schemes.', 'program':programs}, context_instance=RequestContext(request, processors=[shared_app_data]))
        #No program found
    return render_to_response('program_profile.html', {'error': 'This program is not found. You can create your program.'}, context_instance=RequestContext(request, processors=[shared_app_data]))
#end programProfile


#view the program profile, which shows the different schemes and the default keyboard scheme
def previewScheme(request, scheme_id):
    if request.method == 'GET':
        if scheme_id:
            try:
                scheme = Scheme.objects.get(id=scheme_id)
                shortcuts = Shortcut.objects.filter(scheme_id=scheme.id)
                return render_to_response('scheme_preview.html', {'shortcuts' : shortcuts, 'scheme_id' : scheme_id}, context_instance=RequestContext(request, processors=[shared_app_data]))
            except:
                return render_to_response('scheme_preview.html',{'error':'This program does not have any schemes.', 'program':programs}, context_instance=RequestContext(request, processors=[shared_app_data]))
        #No program found
#return render_to_response('program_profile.html', {'error': 'This program is not found. You can create your program.'})
    return render_to_response('scheme_preview.html', {'error': 'This program is not found. You can create your program.'}, context_instance=RequestContext(request, processors=[shared_app_data]))
#end programProfile


#retrieve Keyboard sortcuts for that scheme with jQuery AJAX
def retrieveKeyboardData(request):
    if request.method == 'POST':
        try:
            #retrieve id from ajax call
            rid = int(request.POST.get('id'))
            shortcuts = Shortcut.objects.filter(scheme_id=rid)            
            shortcutsList = list(shortcuts.values())
            try:
                return HttpResponse(simplejson.dumps(shortcutsList), mimetype="application/json")
            except:
                return HttpResponse(simplejson.dumps({'error':'exception in json occured'}), mimetype="application/json")
        except:
            return HttpResponse(simplejson.dumps({'error':'exception in db with shortcuts occured'}), mimetype="application/json")
    return HttpResponse(simplejson.dumps({'error':'not entered post'}), mimetype="application/json")
#end retrieveKeyboardData


#used to retrieve scheme info with an AJAX call
def retrieveSchemeDataAJAX(request):
    if request.method == 'POST':
        try:
            #retrieve id from ajax call
            rid = int(request.POST.get('id'))
            scheme = Scheme.objects.get(id=rid)
            return HttpResponse(simplejson.dumps({'schemeName':scheme.name, 'schemeDesc': scheme.desc}), mimetype="application/json")
        except:
            return HttpResponse(simplejson.dumps({'error':'exception in json occured'}), mimetype="application/json")
    return HttpResponse(simplejson.dumps({'error':'not entered post'}), mimetype="application/json")


#used for the autocomplete on key names
def autoCompleteKey(request):
    if request.method == 'POST':
        try:
            partialName = request.POST.get('partialName')
            schemeID = request.POST.get('scheme_id')
            keys = Shortcut.objects.filter(name__icontains=partialName, scheme_id=schemeID)[:10]
            return HttpResponse(simplejson.dumps(list(keys.values())), mimetype="application/json")
        except:
            return HttpResponse(simplejson.dumps({'error':'not entered post'}), mimetype="application/json")
    return HttpResponse(simplejson.dumps({'error':'not entered post'}), mimetype="application/json")

#log in. Aways returns to index/home for now. Should stay on page that called log in or continue to the create/edit contents page
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active: # Correct password, and the user is marked "active"
            auth.login(request, user)
            Msg = ''
            return HttpResponseRedirect(request.META['HTTP_REFERER'])
            #return render_to_response('index.html', {'Msg': Msg}, context_instance=RequestContext(request, processors=[shared_app_data]))
    Msg = ''
    return render_to_response('index.html', {'Msg': Msg}, context_instance=RequestContext(request, processors=[shared_app_data]))

def logout(request):
    if request.user.is_authenticated():
        auth.logout(request)
        Msg = 'You have been logged out successfully.'
        return HttpResponseRedirect(request.META['HTTP_REFERER'])
        #return render_to_response('index.html', {'Msg': Msg}, context_instance=RequestContext(request, processors=[shared_app_data]))
    return render_to_response('index.html', context_instance=RequestContext(request, processors=[shared_app_data]))


##############################################
#
##########   DATA CREATE   ################


def addProgram(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if request.method == 'POST':
            form = ProgramForm(request.POST)
            if(form.is_valid()):
                form.save()
                return HttpResponseRedirect('/')
            else:
                return render_to_response('add_program.html', {'form': form}, context_instance=RequestContext(request, processors=[shared_app_data]))
        form = ProgramForm()
        return render_to_response('add_program.html', {'form': form}, context_instance=RequestContext(request, processors=[shared_app_data]))
#end addProgram


#addScheme
def addScheme(request,program_id):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if request.method == 'POST':
            form = SchemeForm(request.POST)
            if not program_id:
                return HttpResponseRedirect('/')
            try:
                program_id=int(program_id)
            except:
                return HttpResponseRedirect('/')

            form.program_id = program_id

            if(form.is_valid()):
                scheme = form.save(commit=False)
                scheme.program_id = program_id
                scheme.save()
                print form.cleaned_data
                form.save_m2m()
                return HttpResponseRedirect('/programs/profile/'+str(program_id))
            else:
                return render_to_response('add_scheme.html', {'form': form}, context_instance=RequestContext(request, processors=[shared_app_data]))
        if program_id:
            try:
                program_id=int(program_id)
                form = SchemeForm()
                form.program_id = program_id
                return render_to_response('add_scheme.html', {'form': form}, context_instance=RequestContext(request, processors=[shared_app_data]))
            except:
                return HttpResponseRedirect('/')
        return HttpResponseRedirect('/')
#end addScheme


def inputKeyboard(request, scheme_id):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if scheme_id:
            try:
                scheme_id=int(scheme_id)
                form = KeyboardForm()
                form.scheme_id = scheme_id
                return render_to_response('keyboard_form.html', {'form': form}, context_instance=RequestContext(request, processors=[shared_app_data]))
            except:
                return HttpResponseRedirect('/')
        return HttpResponseRedirect('/')
#end inputkeyboard


#ajaxto add a shortcut for a scheme
def addShortcutAJAX(request):
    if request.method == 'POST':
        form = KeyboardForm(request.POST)
        if(form.is_valid()):
            try:
                print request.POST.get('id')
                id = int(request.POST.get('id'))
            except:
                return HttpResponse(simplejson.dumps({'added':'false','reason':'invalid id'}), mimetype="application/json")
            shortcut = form.save(commit=False)
            shortcut.scheme_id = id
            shortcut.save()
            return HttpResponse(simplejson.dumps({'added':'true'}), mimetype="application/json")
    return HttpResponse(simplejson.dumps({'added':'false', 'reason':'not entered post or save failed'}), mimetype="application/json")
        
#
#def registerUser(request):
#    if request.method == 'POST':
#        form = UserCreationForm(request.POST)
#        if form.is_valid():
#            new_user = form.save()
#            return HttpResponseRedirect("/")
#    else:
#        form = UserCreationForm()
#    return render_to_response("register.html", {'form': form})