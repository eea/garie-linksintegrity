### Changelog

#### 1.4.0 - 2025-04-07
- **Code Refactoring**: Remove docker depenency and use link integrity python package directly.
  - **File**: Dockerfile
  - **Details**: Changed to Node 20 LTS and added python dependencies for link integrity.
  - **File**: src/my_script.sh
  - **Details**: removed docker run command and used the link integrity python package directly.