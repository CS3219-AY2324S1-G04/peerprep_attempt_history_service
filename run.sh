# #!/bin/bash

attempt_service_image_name='peerprep_attempt_service_api'
# room_service_mongo_init='peerprep_room_service_mongo_init'

cd ./attemptApi
npm run build 

if [ $? -eq 0 ]; then
    # Step 3: If npm run build succeeded, run docker build
    docker build -t "$attempt_service_image_name" .
else
    # Step 4: If npm run build failed, display an error message
    echo "npm run build failed. Aborting Docker build." 
    exit 1
fi

cd ..

# cd ./roomMongoInit
# npm run build

# if [ $? -eq 0 ]; then
#     # Step 3: If npm run build succeeded, run docker build
#     docker build -t "$room_service_mongo_init" . 
# else
#     # Step 4: If npm run build failed, display an error message
#     echo "npm run build failed. Aborting Docker build."
#     exit 1
# fi

# cd ..

docker-compose create