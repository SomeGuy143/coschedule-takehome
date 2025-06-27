# coschedule-takehome

Thanks for looking at my project! I chose to use the NYT Books API.

The client portion is in the "frontend" folder and is implemented in plain HTML/CSS/JavaScript. The server component is in the "backend" folder and the entrypoint is the server.js file. I opted to write the backend with NodeJS so that the CoSchedule team would have an easier time reviewing it. This was my first time using JavaScript for a backend task and setting up a NodeJS project, so there may be some quirks in my approach. 

I kept dependencies pretty minimal: mainly sqlite3 (for an in-memory database to hold comments, ratings, and users) and express (for a less tedious way to handle routing).

## Run/Debug Locally

You will need an .env file containing defintions for API_KEY and NYT_BASE_URL. Since this is a public repo I won't upload it here, but will email it to you instead. All you need to do is drop it into the "backend" folder.

Once you've done that, you should be able to run an instance of both the server and client locally. If you're running both in VS Code, you may need to duplicate your workspace (Ctrl+Shift+P and look for "Workspaces: Duplicate As Workspace in New Window").

## Rate Limiting

The NYT Books API does rate limit to 5 requests per minute and 500 requests per day. Keep that in mind if you're spamming the search button.

## Persistence of Data

Keep in mind that the database holding comments, users, and ratings is *in memory* so any data you create will be lost if the server is restarted.

## Login

A login page is provided but there is no auth required for the endpoints in my api. I had planned to implemement simple session based auth but ended up tight on time to work on this project. Still, the login/logout logic will let you test leaving comments and ratings as multiple users if you want.