@echo off
echo.
echo  Pushing portfolio to GitHub...
echo.

cd /d "c:\Users\wwwku\OneDrive\Desktop\Portfolio"

git add .
git commit -m "Update portfolio"
git push origin main

echo.
echo  Done! Your site will update in ~1 minute at:
echo  https://kumar1201.github.io/portfolio/
echo.
pause
