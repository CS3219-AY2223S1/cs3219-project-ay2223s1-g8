# PeerPrep Question Service

### Development

1.  Navigate to the `question-service` directory.
    ```shell
    cd question-service
    ```

2.  Install dependencies.
    ```shell
    npm ci
    ```

3. Setup `.env` file.
   Create a `.env` file in the `question-service` directory according to the [`.env.sample`](/question-service/.env.sample) file.

4.  Setup postgreSQL on the machine.
    Create a server with the following properties:
    * Host name: localhost
    * Port: 5432

    Create 2 databases called `question-db` and `question-db-test`.

5.  Generate the `TOKEN_KEY` from `node` in the terminal.
    This key aids in the generation of a random question for the frontend.

    Ensure that you have `node` on your machine by running `node -v`.
    
    Follow the commands as shown below to generate the key:
    ```shell
    > node
    > require('crypto').randomBytes(64).toString('hex')
    ```

    Save this string of characters as the value of `TOKEN_KEY` in the `.env` file.

    Type `.exit` to leave the `node` environment.

6.  To start the development server locally, run the following command:
    ```shell
    npm run dev
    ```
    Access the server at [http://localhost:8002/]().

7.  To run the tests, use the following command:

    ```shell
    npm test
    ```
