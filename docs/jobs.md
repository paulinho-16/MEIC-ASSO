# uni4all Jobs

## Features

This component is responsible for fetching the jobs listings present on SIGARRA. It was built in an initial stage of development as a small demo for the uni4all API.

## Technologies

- [Cheerio](https://cheerio.js.org/): to scrape contents from SIGARRA.

## API Endpoints

### GET `/jobs`

This route was created to retrieve jobs, it will return a response with a status code of:
- `200` the request was made successfully
- `500` there is a problem fetching data from SIGARRA or another unexpected error
