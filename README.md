# Web Application Template
![build status](https://travis-ci.org/dewv/APPNAME.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/dewv/APPNAME/badge.svg?branch=master)](https://coveralls.io/github/dewv/webapp-template?branch=master)

This repository is a template that can be used as a starting point for a Web app that uses `mmvece` to implement the [Model-View-Controller architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

## How to create a new application using this template.

Choose a name for your new application. Insert it into the commands that follow, intead of the placeholder `<appname>`.

1. Clone this template repository to c9, or wherever you will do the work. You will now have a folder named `mmveceAppTemplate`.
2. Delete the `mmveceAppTemplate/.git` subfolder. This will destroy your local repo's history, so that it is no longer a connected clone of this GitHub template repo. (`.git` is a hidden folder; in c9's file tree you must activate the display of hidden files.)
3. Edit the `mmveceAppTemplate/package.json` file. Search and replace all appearances of `APPNAME` with `<appname>`. Save the file.
4. Rename the folder `mmveceAppTemplate` to `<appname>`.
5. Open a terminal, and change to the `<appname>` folder. Run `git init` to initialize tracking in a new local git repository. The prompt should now show that you are on the master branch.
6. Run `git add --all` and `git commit -m "Add all the files"` to commit your changes to the new local repo.
7. At github.com, create a new **empty** repository named `<appname>`. (It should not contain a README, license file, `.gitignore`, or anything at all.)
8. Back in your terminal, on the master branch, run `git remote add origin https://github.com/dewv/<appname>.git`. This creates a connection between your local repo and the empty one that you just created at GitHub.
9. Run `git push --set-upstream origin master` to connect the local and remote master branches and push your local commit to GitHub.
10. Run `npm install` to set up the app and install all of its dependencies. Some worrisome errror/warning messages appear, but they are harmless.
11. Run `git add --all` and `git commit -m "Ran npm install"` to commit the installation changes to your local repo.
12. Run `git push` to push these changes to GitHub.

You are now ready to begin building your app with MVC services.
1. In your new app repo, edit this `README.md` file. Change the top level heading to describe your app. Change `APPNAME` in the two badge links to `<appname>`. Remove the instructions for creating the app from the template. 
2. If you are using c9, and your new repo is not the top of the workspace, consider copying or linking the `.eslintrc` into the parent directory. (This file configures the static analysis messages that appear as icons in the editor's margin, but c9 only apply the configuration if the file is at the top of the workspace.)
3. Consider creating a `.env` file. In c9, this is generally unnecessary: the `mmvece` code defaults to using c9 MySQL credentials, and using port 8080 for the node.js server. These defaults can be overriden by creating a `.env` file (format shown below) with the desired configuration values.

```
# Node.js server will listen on:
PORT=8080

# Application will use these credentials for MySQL connection:
dbUser=root
dbPassword=secret
```
