 #!/usr/bin/env bash
 # TODO update with new file structure

 ### Bundle Backend ###
 rm -rf ./build
 tsc

 ### Bundle Frontend ###
 cd frontend
 npm run build
 mv build ../build/frontend