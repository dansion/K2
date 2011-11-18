set x=wangwang

mkdir build\chrome

cd chrome\%x%

"C:\Program Files\WinRAR\WinRAR.exe" a -r -afzip "%x%.jar"

move %x%.jar ..\..\build\chrome\

cd ..

if exist api mkdir ..\build\chrome\api
xcopy api ..\build\chrome\api /E

cd ..

copy install.rdf build

REM copy install.js build

copy chrome.manifest build

REM copy notice.txt build

REM copy gpl.txt build

REM copy readme.txt build

REM copy license.txt build

if exist components mkdir build\components
xcopy components build\components /E

if exist defaults mkdir build\defaults 
xcopy defaults build\defaults /E

if exist plugins mkdir build\plugins 
xcopy plugins build\plugins /E

cd build

"C:\Program Files\WinRAR\WinRAR.exe" a -r -afzip "%x%.xpi"

move "%x%.xpi" ..\

cd ..

rd build /s/q

move "%x%.xpi" "D:\Tools\Explorer\Firefox\Data\profile\extensions"