@ECHO Off
ECHO Dette skriptet vil installere Python-modulen Flask. Deretter vil en flask server kj�re for � gj�re at JS kan laste inn filer
ECHO Lukk terminalen for � stoppe
pause
pip install -r requirements.txt
ECHO Trykk p� lenken som kommer under e.g. 127.0.0.1:5000
pause
flask --app host_server.py run