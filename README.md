# Planetary Orbit Simulation via WebGL2
WebGL2.0 project that simulates the orbits of planets around a star, adjusting the mass and distance to see how these variables affect orbital paths, exploring Kepler's laws.

## About
Our final exam project at 2024 Fall Hacettepe course BBM412 – Computer Graphics.

Play the game on your browser from [here](https://hopeorb.github.io/PlanetaryOrbitSimViaWebGL2/)\
Watch the trailer from [here](https://www.youtube.com/watch?v=PiQDeAovByc).

<br>

## How to Run
### Install (make ready for start):
 - CD to the project directory (where `package.json` is located in)
 - (project dir)$ *`npm install`*
     - A folder named *node_modules* will appear (if there is not). NPM will scan *package.json* files, from the project's and recursively all the dependencies', download them and populate that folder with the dependencies. The page and scripts refer to the modules (such as Three.js) that are inside this folder, so gathering the dependencies is essential.
     - Same logic as Apache Maven — It also identifies packages of the project as such files (pom.xml) which declares name/version etc. identification stuff and dependencies.

<br>

### Start:
 - Do **either**:
     - (project dir)$ *`npm run dev`*
         - This will make the `vite`, a tiny server program serving the files, launch and start listening at the port **`5173`** (just like Jupyter notebook).
     - Open the project in NetBeans and hit start.
         - A lightweight file server by NetBeans (which can be configured from `Project Settings` > `Run`) will start listening at the port **`8383`**.
 - Then:
     - Go to http://localhost:XXXX/index.html (depending on the what port the server listens at) in a web browser on the same network.