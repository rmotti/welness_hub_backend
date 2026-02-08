curl --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "rodrigoms",
    "email": "rodrigo@gmail.com",
    "password": "senha123"
}'