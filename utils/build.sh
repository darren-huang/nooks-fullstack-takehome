 #!/usr/bin/env bash

 ### Bundle Backend ###
 rm -rf ./build
 tsc

 ### Bundle Frontend ###
 cd frontend
 npm run build
 mv build ../build/frontend