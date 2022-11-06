## History-service

### Development

1.  Navigate to the `history-service` directory.
    ```shell
    cd history-service/
    ```

2.  Install dependencies.
    ```shell
    npm ci
    ```

3.  To start the development server locally, run the following command:
    ```shell
    npm run dev
    ```

    Access the server at [http://localhost:8004]().

4.  To run the tests, use the following command:
    ```shell
    npm test
    ```

### Endpoints

#### `GET /history-api/history/all`

Returns all the histories in the database.

_Example response:_
```json
{
  "message": "All history retrieved successfully!",
  "data": [
    {
      "uid": "user-1",
      "attempts": [
        {
          "qid": "question-1",
          "content": "console.log(\"Hello world!\");",
          "attemptDate": "2022-10-09T15:10:36.244Z"
        }
      ]
    },
    {
      "uid": "user-2",
      "attempts": [
        {
          "qid": "question-1",
          "content": "console.log(\"Hello world!\");",
          "attemptDate": "2022-10-09T15:10:40.480Z"
        }
      ]
    }
  ]
}
```

#### `GET /history-api/history`

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
      "uid": "user-1",
      "attempts": [
        {
          "qid": "question-1",
          "content": "// NEW ATTEMPT console.log(\"Hello world!\");",
          "attemptDate": "2022-10-09T09:14:46.064Z"
        }
      ]
    }
  ]
}
```

#### `GET /history-api/history/attempt`
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
    "attemptDate": "2022-10-09T09:13:30.696Z"
  }
}
```

#### `POST /history-api/history`
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
        "attemptDate": "2022-10-09T15:10:40.480Z"
      }
    ]
  }
}
```

#### `POST /history-api/history/attempt`
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
    "uid": "user-1",
    "attempts": [
      {
        "qid": "question-1",
        "content": "// NEW ATTEMPT console.log(\"Hello world!\");",
        "attemptDate": "2022-10-09T09:14:46.064Z"
      }
    ]
  }
}
```

#### `DELETE /history-api/history/all`
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

#### `DELETE /history-api/history`
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
    "uid": "user-1",
    "attempts": [
      {
        "qid": "question-1",
        "content": "console.log(\"Hello world!\");",
        "attemptDate": "2022-10-09T15:10:40.480Z"
      }
    ]
  }
}
```
