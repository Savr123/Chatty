echo off
start cmd /k "cd client && npm start"
cd api/chatty.api/ && dotnet run