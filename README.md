# liff-sampel-zero

This is a small web application that demonstrates the basic functionality of the [LINE Front-end Framework (LIFF)](https://developers.line.biz/en/docs/liff/overview/).

## Deploy methods

Depending on how you want to use LIFF, choose one of these methods for deploying the LIFF v2 starter app:

- If you merely want to try the functions LIFF offers, see [Use Heroku button to deploy the app without using the terminal](#Use-Heroku-button-to-deploy-the-app-without-using-the-terminal)

## Use Heroku button to deploy the app without using the terminal

Follow the below instructions to deploy your app using the Heroku button and Node.js without customization.

### What you'll need

| Item | Description |
| ---- | ----------- |
| LINE Login channel | A LINE Login channel forms the connection between your app and LINE Login. Create a channel on the [LINE Developers Console](https://developers.line.biz/console/register/messaging-api/channel/). |
| Heroku account (optional) | [Heroku](https://www.heroku.com) is a cloud service that lets you deploy and serve web apps. You don't need a Heroku account if you're [deploying the app on another platform](#deploy-the-app-using-any-other-server-platform). |

### Deploy the app using 'Deploy to Heroku' button

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/eliteraihan/liff-note)

1. Click **Deploy to Heroku** above.
2. On the "Create New App" page in Heroku, fill in the required information.
3. Click **Deploy app**.
4. Click **View** to confirm that your app is successfully deployed. You should see a page with the text "You have not assigned any value for LIFF ID".
5. Take a note of your app's URL (`https://{Heroku app name}.herokuapp.com`). You'll need it when you add the app to LIFF.

### Add the starter app to LIFF

1. Follow the instructions on the page [Adding a LIFF app](https://developers.line.biz/en/docs/liff/registering-liff-apps/).
2. Take a note of your LIFF ID, because you'll need it for the next part. The LIFF ID is the final part of the **LIFF URL** shown in the console: `https://liff.line.me/{liffId}`.
3. Locate the **Scope** option and click the **Edit** button.
4. Click the **View all** option, enable `chat_message.write`. This scope is required for the LIFF app to send messages on behalf of the user.
5. If the status of the channel is "Developing", click the **Developing** status button and publish the channel.

### Pass your LIFF ID to the app using an environment variable

1. In Heroku, go to [Dashboard](https://dashboard.heroku.com/).
2. Select your app.
3. On the **Settings** tab, click **Reveal Config Vars**.
4. Enter a new key called `MY_LIFF_ID` with your LIFF ID as the value.
5. Click **Add** to save.
6. Browse back to your app's URL (`https://{Heroku app name}.herokuapp.com`) and confirm that your app is operational. You should see a number of buttons, such as **Open External Window** and **Close LIFF App**.

For more information about how to try the app, see [Trying the app](#trying-the-app).
