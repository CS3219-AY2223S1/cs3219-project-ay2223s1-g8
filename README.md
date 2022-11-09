# CS3219-AY22-23-Project-Group 8

**PeerPrep** is an interview preparation web application that matches two users to practise whiteboard-style questions in order to help students or users better prepare themselves for technical interviews.

### Team Members
* Bu Wen Jin
* Foong Siqi
* Li Huankang
* Jonas Ng Zuo En

### Microservices
Service | Description | Documentation | Link
:-|:-|:-|:-
Frontend | Interface for users to interact with the system | [Frontend Documentation](/frontend/README.md) | [http://localhost:3000]()
User Service | Handles authentication of users | [User Service Documentation](/user-service/README.md) | [http://localhost:8000]()
Matching Service | Handles matching of users via difficulty level selected | [Matching Service Documentation](/matching-service/README.md) | [http://localhost:8001]()
Question Service | Stores all questions of various difficulty and randomly assigns a question to new matches based on difficulty level | [Question Service Documentation](/question-service/README.md) | [http://localhost:8002]()
Collaboration Service | Handles editor collaboration between matched users | [Collaboration Service Documentation](/collab-service/README.md) | [http://localhost:8006]()
Communication Service | Enables 2-way communication between matched users in a collaboration room | [Communication Service Documentation](/communication-service/README.md) | [http://localhost:8005]()
History Service | Store user's latest question attempts | [History Service Documentation](/history-service/README.md) | [http://localhost:8004]()

### Deployment

We are using Google Kubernetes Engine to deploy all our microservices on Google Cloud.

**Deployed Link** (up until Demo on 11 Nov 2022): http://35.224.11.115:3000/.

For more details on deployment, read the [Deployment Documentation](/deployment/README.md).