from django.conf.urls import patterns, include, url
from keyboard.keyboard_input.views import *
# thee next to imports are for admin
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'keyboard.views.home', name='home'),
    # url(r'^keyboard/', include('keyboard.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),

     #
     # Pages
     ###########
     #('^$', index), #old index
     ('^$', browseAllPrograms),
     (r'^programs/search/$', programSearch),
     (r'^programs/results/([a-zA-Z\+{0,1}]+)/', programResults),
     ('^programs/results/$', programResults),
     ('^programs/browse/$', browseAllPrograms),
     (r'^programs/profile/(\d{1,4})/$', programProfile),
     (r'^keyboard/input/(\d{1,4})$', inputKeyboard),
     ('^programs/add/$', addProgram),
     ('^schemes/create/(\d{1,4})$', addScheme),
     ('^schemes/preview/(\d{1,4})$', previewScheme),
     #
     # Util
     #########
     ('^login/$', login),
     ('^logout/$', logout),
     #
     # AJAX
     ###########
     ('^shortcutsAJAX$', retrieveKeyboardData),
     ('^schemeAJAX$', retrieveSchemeDataAJAX),
     ('^addShortcutAJAX$', addShortcutAJAX),
     ('^keysSearchAJAX$', autoCompleteKey),
     #
     # For error handling -> These should redirect to a custom error page instead of index
     ############
     (r'^programs/profile/$', index),
     ('^schemes/create/$', index),
     (r'^keyboard/input/$', index),
#     ('^keyboard/$', keyboard),

)
