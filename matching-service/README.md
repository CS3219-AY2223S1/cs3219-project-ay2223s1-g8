# PeerPrep Matching Service

### Development

1.  Navigate to the `matching-service` directory.
    ```shell
    cd matching-service
    ```

2.  Install dependencies.
    ```shell
    npm ci
    ```

3. Setup `.env` file.
   Create a `.env` file in the `matching-service` directory according to the [`.env.sample`](/matching-service/.env.sample) file.

4.  Setup postgreSQL on the machine.
    Create a server with the following properties:
    * Host name: localhost
    * Port: 5432

    Create 2 databases called `peerprep` and `peerpreptest`.

5.  To start the development server locally, run the following command:
    ```shell
    npm run dev
    ```
Access the server at [http://localhost:8001]().
