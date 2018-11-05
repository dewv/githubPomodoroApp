# GitHub Pomodoro App

This application is for use by DevOps staff to track working time. The idea is to use the [Pomodoro](https://www.slideshare.net/samakays/the-pomodoro-technique-v1-3) time management process while tracking tasks using GitHub Issues.

The workflow starts with staff viewing (at github.com) an open GitHub Issue that is assigned to them. Each issue would contain a link reading "Start a Pomodoro for this Issue" that GETs our app's `/pomodoro/new` URL. [This gist](https://gist.github.com/smattingly/38607352a1cdd4821e777553583b9c15) explains how to get the link into every GitHub Issue.

## The `pomodoro` service

The database will have two tables that are owned by this service.
1. `issue` is a table that mirrors GitHub Issues, with columns for pk, repoName, (GitHub) issueNumber, title, estimate1, estimate2, estimate3. The last three are numeric and will not be used in the initial release.
2. `pomodoro` is a table whose rows represent a pomodoro work session. Columns: pk, issueFK (a foreign key identifying the associated issue), status, user, startTime. Values for status are STARTED, CANCELED, ABANDONED, COMPLETED; but these should probably be stored as numbers rather than strings. startTime is actually a date/time combination.

In addition to the usual MySQL database management, the Pomodoro service model will also treat GitHub as a kind of database, using the GitHub API to extract data across the Internet. 

The only pomodoro that a user can read(as a single record, not list)/edit is the one currently active pomodoro (status = STARTED) they have, if there is one. To support this the model will need to override the `read` method:
- Query the database to get id = pk of the user's currently active pomodoro.
- Set `this[this.constructor.dbBinding.mainTable.key.property] = id;
- Call the base class `read` method

The model will also need to override `save`:
- Call the base class `save` to update MySQL as usual
- If this.status is COMPLETED, use the GitHub API to add a comment to the GitHub Issue: ":pomodoro: logged by githubPomodoroApp". (This update uses OAuth so that the GitHub Issue comment is created "by" the user.)

The model will need to define a method `markAbandoned` that updates the pomodoro table to set status = ABANDONED for records with status=STARTED and now - start_time > pomoLength + breakLength. In other words, the user has abandoned a pomodoro if it's timer has expired and the break timer has also expired without the user setting status to COMPLETED. (This update should be for all users, not just the current one.) The controller should call this method on as many requests as reasonable.

This service has some differences from standard RESTful API, so a custom Controller subclass is needed.

### `/pomodoro/`

This is the "list all" URL. This will work as usual, except that the user can list all their *own* pomodoros, not all of *everyone's*. TBD: how to make this happen?

### `/pomodoro/new`

This is the "enterNewData" URL. 

#### Controller

Call model's `markAbandoned`.

Controller will need custom code to extract the GitHub Issue number and repository name from the HTTP referrer. This code is available from [this gist](https://gist.github.com/smattingly/5bf9c3c0e328c71db09a90a7c942c8cf).

The controller should send the resulting information to the model's `whyNotCreate` method. (TBD: Is there a clear way to pass this info in the call?) 

If the model returns message(s), the controller calls views to display the message(s). Exception: If the model returns the message that user can't start a pomodoro because one is active (see below), controller should redirect to `/pomodoro/edit`. 

If the model returns `undefined`, controller should redirect to `/pomodoro/edit`. 

For the first release, there is no form (view) for creating the pomodoro; it is all done by code. In a later release, there will be a create form to support estimates following [pomodoro estimation technique](https://www.slideshare.net/samakays/the-pomodoro-technique-v1-3) section 2.3 

#### Model

The model's `whyNotCreate` method will use the GitHub API to retrieve data for the identified Issue. If the Issue is 1) Closed and/or 2) not assigned to the currently logged in user (staff member), the method will return appropriate messages.

Once the GitHub Issue has been validated as Open and assigned to this user, `whyNotCreate` turns to our MySQL database. 
- Query for `inProgress`: the number of pomodoro records for current user with status = STARTED. If inProgress is 1, return message: "You have already started an active pomodoro. You cannot start another." If inProgress > 1, return same message, but first log this as an error. (A user can only have one pomodoro running at a time.)
- If there is no `issue` record for the GitHub repo name and issue number, an `issue` record is created; otherwise, the MySQL title is updated to match the title at GitHub (this is in case it has been edited).
- Create a pomodoro record, linked to the issue record, with the current system date/time stored as startTime. Return undefined.

### GET `/pomodoro/edit`

#### Controller

Call model's `markAbandoned`.

Unlike most RESTful services, there is no id number/parameter as part of the edit URL. This is because the user can only edit their one active pomodoro, if it exists.

#### Model

`whyNotEdit` will query for `inProgress` as described above. If inProgress is 1, return undefined; if 0, return message: "You do not have an active pomodoro."; otherwise (> 1) return message: "You have multiple active pomodoros, and that's a problem."

#### Views

The edit form already exists in some form; it was created in an outdate repo. The Views files can be found in this [archived repo](https://github.com/dewv/github-pomodoro/tree/creatingViewsforPomodoro/views). 

During the 25 minute length of the pomodoro, the form shows a countdown timer, and a "Cancel pomodoro" button. When the timer expires, a 5 minute break timer begins counting down, the cancel button is hidden, and a "Complete pomodoro" button is shown. When the 5 minute timer expires, the complete button is hidden, and a "Start new pomodoro for this issue" link to `/pomodoro/new` appears. TBD: need to somehow send identification of issue, in place of GitHub referrer info.

The buttons may actually be one button, with a changing label. In any case, clicking one/it should POST to `/pomodoro/edit` after setting the pomodoro's status appropriately. 
