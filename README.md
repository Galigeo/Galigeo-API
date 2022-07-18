# Galigeo API
Javascript API to embed Galigeo maps

## Project structure
api: Galigeo API source code
samples: A set of simple demo to illustrate how to use the api

## Build the project

```
cd api
npm install
npm run build
```
(npm run build:dev for development)

## Run the samples
The simplest way to run the samples is to start the Node http-server. 

```
npm install -g http-server
cd samples
http-server -p 3000
```

## Build the documentation
On Windows:
```
cd api\doc
buildDoc.bat
```
