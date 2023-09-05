@ECHO Off
ECHO Dette skriptet vil installere Python-modulen Flask. Deretter vil en flask server kjøre for å gjøre at JS kan laste inn filer
ECHO Lukk terminalen for å stoppe
pause
pip install -r requirements.txt
ECHO Trykk på lenken som kommer under e.g. 127.0.0.1:5000
pause
flask --app host_server.py run