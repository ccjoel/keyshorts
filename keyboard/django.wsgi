import os
import sys

os.environ['DJANGO_SETTINGS_MODULE'] = 'keyboard.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

path = '/home/quilesbaker/Desktop/www/keyboard/'
if path not in sys.path:
    sys.path.append(path)
