
# 🦚lenk.cf

A URL shortner made using NodeJS, MongoDB and Vercel serverless function.
This project also includes a serverless API. With the help of this API we can Integreate the URL shortner with basic
static (HTML/CSS/JS ) websites. This website can also serve as a Progresive Web Application (PWA) where you can install this website as a normal Application on your PC or Phone.


&nbsp;
## Tech Stack

**Client:** HTML, SCSS, JS, Bootstrap, Materialize

**Server:** Node,TS, MongDB, Vercel Serveless function.

  
## 🎦 Screenshots


&nbsp;

![App Screenshot](https://raw.githubusercontent.com/adithyapaib/lenk.cf/main/static/screenshots/Screenshot1.png)

&nbsp;

![App Screenshot](https://raw.githubusercontent.com/adithyapaib/lenk.cf/main/static/screenshots/Screenshot%202.png)


&nbsp;
  
## 💻Requirements

- NodeJS 
- MongoDB (Atlas)
- Vercel CLI

  
&nbsp;
## 🌐Deployment

To get this poject running, firstly install vercel CLI on your PC with the following command.

```javascript
  npm i -g vercel
```

Secondly, goto [MongoDB](https://cloud.mongodb.com/) and configure a MongoDB Atlas cluter running, Setup the MongoDB clutter and copy the URI for NodeJS application.



After the MongoDB setup is done clone this project and install the packages.
```javascript
  git clone https://github.com/adithyapaib/lenk.cf
  cd lenk.cf
  npm i
```
create **.env**  file in the root folder and create variable DB and paste your MongoDB URI


```javascript
 DB = YOUR_URI_WITHOUT_QUOTES
```

After everthing is installed to locally deploy this project type

```javascript
 vercel dev
```

Login with your  [Vercel](https://cloud.mongodb.com/) account and your all set for Local Deployment on.

```javascript
 localhost:3000
```

For web Deployment on  [Vercel](https://cloud.mongodb.com/) use

```javascript
 vercel deploy
```


&nbsp;



## 💢 API Reference

&nbsp;

#### API Index

```http
  localhost:300/api/
```

 |Type     |File      |Description                |
 |:------- |:---------|:------------------------- |
 |`string` | index.js |Displays info about API    |

 &nbsp;

#### Redirect to original URL

```http
  localhost:300/${shortId}
```

| Parameter | File          | Description                         |
| :-------- | :-------      | :--------------------------------   |
| `ShortId` | `redirect.js` | **Required** ID of item to redirect |


&nbsp;

#### Register a new URL

```http
 localhost:300/p/
```

| Parameter | File          | Description                                                    |
| :-------- | :-------      | :--------------------------------                              |
| `url`     | `p.js`        | **Required** url of main URL. Responds with a random shortID.  |

&nbsp;

#### List all the URL's in the Database

```http
  localhost:300/all
```

| Parameter | File          | Description                                                    |
| :-------- | :-------      | :--------------------------------                              |
|           | `all.js`      | Displays all the URL's in the database.                        |


&nbsp;
&nbsp;

#### Register a custom ShortId

```http
  localhost:300/custom/<original_url>%3A%3A%3A69<custom_ShortID>
```

| Parameter                         | File                  | Description                                                    |
| :--------                         | :-------              | :--------------------------------                              |
|   `<url>%3A%3A%3A69<customID>`    | `custom.js`           | Checks if the shortID is taken, return true if shortID is unique else return false if there exits any conflict shortID |


&nbsp;
#### If the link dosen't exits in Database
```http
  localhost:300/404
```

| Parameter       | File            | Description                                                    |
| :--------       | :-------        | :--------------------------------                              |
|    `/404`       | `404.html`      | 404 Page                        |


&nbsp;


  

  
## 🛰Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB = YOUR_MONGOURI`


  
## 🌐Domains

Other domains to this project.

[https://4543.ml](https://4543.ml)

[https://urml.ml](https://urml.ml)

  
## 🚦Acknowledgements

 - Dont forget to 🙋🏼‍♂️Follow me on [Github](https://github.com/adithyapaib/) and Star⭐  this Repo

## 📑License

[MIT](https://choosealicense.com/licenses/mit/)

  
