on run argv
	set statusChosen to (item 1 of argv)
	if statusChosen is "Available" then
		tell application "Skype" to send command "SET USERSTATUS ONLINE" script name "AppleScript status setter"
	else if statusChosen is "DND" then
		tell application "Skype" to send command "SET USERSTATUS DND" script name "AppleScript status setter"
	end if
end run