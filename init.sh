#!/bin/bash
docker compose up -d --build
sleep 5

echo "Frontend: http://localhost:4200"
echo "(API): http://localhost:8080/api"