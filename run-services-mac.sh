#!/usr/bin/env bash

osascript -e 'tell application "Terminal"
  activate
  do script "echo Setting up services..." in front window
  
  my makeTab()
  do script "cd ./frontend/" in front window
  do script "npm ci && npm run start-mac" in front window
  
  my makeTab()
  do script "cd ../user-service/" in front window
  do script "npm ci && npm run dev" in front window

  my makeTab()
  do script "cd ../matching-service/" in front window
  do script "npm ci && npm run dev" in front window

  my makeTab()
  do script "cd ../question-service/" in front window
  do script "npm ci && npm run dev" in front window

  my makeTab()
  do script "cd ../collab-service/" in front window
  do script "npm ci && npm start" in front window

  my makeTab()
  do script "cd ../communication-service/" in front window
  do script "npm ci && npm run dev" in front window

  my makeTab()
  do script "cd ../history-service/" in front window
  do script "npm ci && npm run dev" in front window

end tell

on makeTab()
  tell application "System Events" to keystroke "t" using {command down}
  delay 0.2
end makeTab'