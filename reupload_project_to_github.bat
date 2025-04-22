@echo off
echo Initializing Git repository...
git init

echo Adding remote origin...
git remote add origin https://github.com/Alkohlany/arabee-fluent-project.git

echo Adding all files...
git config --global user.name "Alkohlany"
git config --global user.email "abnyemeny@gmail.com"

git add .

echo Creating initial commit...
git commit -m "Reupload project after recovery"

echo Setting main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

pause
