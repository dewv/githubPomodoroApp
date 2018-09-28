# Pomodoro Time Tracker
![build status](https://travis-ci.org/dewv/githubPomodoroApp.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/dewv/githubPomodoroApp/badge.svg?branch=master)](https://coveralls.io/github/dewv/webapp-template?branch=master)

This is the Pomodoro code repository that uses `mmvece` to implement the [Model-View-Controller architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

support [pomodoro estimation technique](https://www.slideshare.net/samakays/the-pomodoro-technique-v1-3) section 2.3 

define stored response for issues, containing link to app:

    database
    	issue: pk, repo, issueNumber, name/desc, est1, est2, est3
    	pomo: issueFK, status, user, start_time 
    
    global set pomoLength = 25m, breakLength = 5m
    
    entry_point:
      get issue number, repo from referrer
      
      IF issue is Closed at github
      	text: only open issues
      	end
      	
      IF issue is not assigned to user at github
      	text: first assign yourself
      	end
      	
      IF no record for repo, issueNumber
        create new issue record
        // later: estimate_form
        end
      ELSE IF name/desc has changed on github
      	update issue record
      	
      update pomos set status = ABANDONED with status=STARTED and now - start_time > pomoLength + breakLength
      set in_progress = count of pomo with issueFK, user, STARTED
      IF in_progress > 1
      	ERROR
      ELSE IF in_progress = 1
        timer_screen
        end
      ELSE // now
        start_pomo
	
      /* later:   
      ELSE	
        set others_in_progress = count of pomos with issueFK, STARTED 
        set completed = count of issue pomos with status = COMPLETED
        set estimate = sum of issue.est1, est2, est3
        IF estimate = (completed + others_in_progress) // including defaults of 0
          estimate_form
          end
        ELSE IF estimate > (completed + in_progress_count)
          start_pomo
          end
        ELSE IF estimate < (completed + in_progress_count)
          ERROR!
 	 */
        
    timer_screen:
      set elapsed = now - start_time
      IF elapsed < pomoLength
      	text: Pomo time remaining:
      	set timer = pomoLength - elapsed
      	timerType = pomo
      ELSE IF elapsed < pomoLength + breakLength
      	test: Your pomo timer has rung. Mark this pomo complete? Break time remaining:
      	set timer = pomoLength + breakLength - elapased
      	timerType = break
      ELSE
        ERROR; end
        
      show countdown from timer
      on timer expires
      	IF timerType = pomo
      		reveal complete button
      		set timerType = break
      		show countdown from breakLength
      	ELSE IF timerType = break
      		hide complete button
      		text: Break's over. Start new pomo? (link)
      on click to complete
        update pomo: status=COMPLETED
        update_github
    	// still showing break timer
      on click to cancel
        update pomo: status=CANCELED
        end
    
    start_pomo:
      on click to start pomodoro    
        new pomo record for issue, user, start_time = now, status = STARTED
        timer_screen
        
    update_github:
      use API to create comment on issue, by user:
      	user completed pomodoro // later: or set estimateX to Y
      	#completed // later: , est1, 2, 3, diffs
      	
	/* later:  
    estimate_form:
      IF all est1,2,3 > 0
      	text: no more estimation; break up task
      	end
      
      IF total_estimated = 0
        text: No estimate exists
      ELSE
      	  text: Pomodoros completed for this issue (warning ? plus others' in progress) equal estimated.
      	Pomodoros cannot start without nonzero estimate remaining. (warning ? consult others)
      input: additional estimated pomodoros // valid: 1 to 6
      on submit
      	update issue: store input in first 0 of est1,2,3
      	update_github
        start_pomo
    */

