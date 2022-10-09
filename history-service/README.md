## History-service

### Development

1. Navigate to the `history-service` directory.

```shell
cd history-service/
```

2. Install dependencies.

```shell
npm ci
```

3. To start the development server locally, run the following command:

```shell
npm run dev
```

Access the server at [http://localhost:8003/]().

4. To run the tests, use the following command:

```shell
npm test
```

### Endpoints

#### `GET /api/history/all`

Returns all the histories in the database.

_Example response:_
```json
{
  "message": "All history retrieved successfully!",
  "data": [
    {
      "_id": "6342e46c0ac274080f7d635c",
      "uid": "user-1",
      "attempts": [
        {
          "qid": "question-1",
          "content": "console.log(\"Hello world!\");",
          "_id": "6342e46c0ac274080f7d635d",
          "attemptDate": "2022-10-09T15:10:36.244Z"
        }
      ],
      "__v": 0
    },
    {
      "_id": "6342e4700ac274080f7d6360",
      "uid": "user-2",
      "attempts": [
        {
          "qid": "question-1",
          "content": "console.log(\"Hello world!\");",
          "_id": "6342e4700ac274080f7d6361",
          "attemptDate": "2022-10-09T15:10:40.480Z"
        }
      ],
      "__v": 0
    }
  ]
}
```

#### `GET /api/history`

Returns the user's history in the database.

_Example request:_
```json
{
  "uid": "user-1"
}
```

_Example response:_

```json
{
  "message": "User history retrieved successfully!",
  "data": [
    {
      "_id": "634290bafddace1b983d251a",
      "uid": "user-1",
      "attempts": [
        {
          "qid": "question-1",
          "content": "// NEW ATTEMPT console.log(\"Hello world!\");",
          "_id": "634290bafddace1b983d251b",
          "attemptDate": "2022-10-09T09:14:46.064Z"
        }
      ],
      "__v": 0
    }
  ]
}
```

#### `GET /api/history/attempt`
Returns the user's __latest__ attempt to the question.

_Example request:_
```json
{
  "uid": "user-1",
  "qid": "question-1"
}
```

_Example response:_
```json
{
  "message": "User attempt retrieved successfully!",
  "data": {
    "qid": "question-1",
    "content": "console.log(\"Hello world!\");",
    "_id": "634290bafddace1b983d251b",
    "attemptDate": "2022-10-09T09:13:30.696Z"
  }
}
```

#### `POST /api/history`
Creates a new user history.

_Example request:_
```json
{
  "uid": "user-1",
  "attempts": [
    {
      "qid": "question-1",
      "content": "console.log(\"Hello world!\");"
    }
  ]
}
```

_Example response:_
```json
{
  "message": "User history created successfully!",
  "data": {
    "uid": "user-1",
    "attempts": [
      {
        "qid": "question-1",
        "content": "console.log(\"Hello world!\");",
        "_id": "6342e4700ac274080f7d6361",
        "attemptDate": "2022-10-09T15:10:40.480Z"
      }
    ],
    "_id": "6342e4700ac274080f7d6360",
    "__v": 0
  }
}
```

#### `POST /api/history/attempt`
Updates the user's attempt for a question.

_Example request:_
```json
{
  "uid": "user-1",
  "attempt": {
    "qid": "question-1",
    "content": "// NEW ATTEMPT console.log(\"Hello world!\");"
  }
}
```

_Example response:_
```json
{
  "message": "User attempt added successfully!",
  "data": {
    "_id": "634290bafddace1b983d251a",
    "uid": "user-1",
    "attempts": [
      {
        "qid": "question-1",
        "content": "// NEW ATTEMPT console.log(\"Hello world!\");",
        "_id": "634290bafddace1b983d251b",
        "attemptDate": "2022-10-09T09:14:46.064Z"
      }
    ],
    "__v": 0
  }
}
```

#### `DELETE /api/history/all`
Deletes all user histories in the database.

_Example response:_
```json
{
  "message": "All user history deleted successfully!",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  }
}
```

#### `DELETE /api/history`
Deletes a user history.

_Example request:_
```json
{
  "uid": "user-1"
}
```

_Example response:_
```json
{
  "message": "User history deleted successfully!",
  "data": {
    "_id": "6342e4700ac274080f7d6360",
    "uid": "user-1",
    "attempts": [
      {
        "qid": "question-1",
        "content": "console.log(\"Hello world!\");",
        "_id": "6342e4700ac274080f7d6361",
        "attemptDate": "2022-10-09T15:10:40.480Z"
      }
    ],
    "__v": 0
  }
}
```
