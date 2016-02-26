on run argv
	set statusChosen to (item 1 of argv)
	tell application "System Events"
		tell application process "SystemUIServer"
			if statusChosen is "enable" then
				try
					key down option
					click menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2
					key up option
				end try
			else if statusChosen is "disable" then
				try
					key down option
					click menu bar item "Notification Center" of menu bar 2
					key up option
				end try
			end if
		end tell
	end tell
end run