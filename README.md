# TypeFace-Project
### Submission for Typeface Assessment

## Project
A simple Dropbox-like application, Simplebox. Provides features such as:
- User SignUp / LogIn
- Drag & Drop feature + ability to select files from local device to upload
- Checks on the uploading files: max 10 files, each file max 5 MB
- List all the files that the user has uploaded
- Ability to download the files later

## Usage:
1. Download the dependencies listed in the `Tech Stack` section
2. Move to the `Simplebox-ui` folder and install the necessary dependencies.
3. Move to the `Simplebox-backend` folder and build the project. Ensure ports 5173, 5432, & 8080 are not being used by other processes.
4. Run the UI and start the Docker containers
```
npm install
npm run dev

mv clean package
docker-compose up -d --build
docker-compose logs -f  // to follow logs
```


## Tech Stack used for the Project:
### 1. Backend
* `Java Spring Boot` for building the backend APIs
### 2. Frontend
* `React` framework for building the UI
* `Vite` for the build process
* `shadCN`, `TailwindCSS`, and `lucid-react` for the Styling and a few components
### 3. Database
* `postgres 15` to store User information and File metadata
* `on-device storage` to store the files

### 4. Containerization
* `docker-compose` for creating Docker containers of Postgres and backend APIs

## Future Scope:
* Integrate security features like `jwt` for API requests
* Store files in NoSQL databases like `MongoDB` instead of in local storage