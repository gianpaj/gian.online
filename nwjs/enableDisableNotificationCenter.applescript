tell application "System Events"
	tell application process "SystemUIServer"
		try
			if exists menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2 then
				key down option
				click menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2
				key up option
			else
				key down option
				click menu bar item "Notification Center" of menu bar 2
				key up option
			end if
		on error
			key up option
		end try
	end tell
end tell