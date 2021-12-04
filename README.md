# Paper Scout

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Firebase Deploys

We're hosting with Firebase, and also using Firebase auth and
Firestore DB. Deploying happens automatically via github actions
whenever a PR is merged or whenever master is pushed.

## Thoughts on Firestore

We're using Firestore because it's free, but we're going to pretend
it's an SQL database so that it's easier to migrate later. Why? AFAICT
NoSQL is only the correct choice when you need to support huge write
scalability and are willing to sacrifice a bunch of ACID
features. More subjectively, I also think NoSQL makes it harder to "do
the right thing" by giving you too many choices (and therefore burns
developer time in the long run). In SQL, there's usually one or two
"right" ways to normalize data that efficiently support many types of
queries. In NoSQL, you basically have to know what all your query
patterns are up front and design your data for that.

In my experience, the data model changes much less frequently than the
queries. If this ends up being worth expanding, I'll probably move to
Postgres + GraphQL.
