## Index
curl "http://localhost:3333/api"

## Rooms
curl "http://localhost:3333/api/rooms"

## Existing Room
curl "http://localhost:3333/api/rooms/11111111"

## GET Room Submission
curl "http://localhost:3333/api/rooms/11111111/submission"

## UPDATE Room
curl -X "PUT" "http://localhost:3333/api/rooms/11111111" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "name": "Javascript 201",
  "attendance": [
    {
      "name": "student",
      "label": "Student",
      "amount": "0"
    },
    {
      "name": "instructor",
      "label": "Instructor",
      "amount": "0"
    }
  ],
  "submission": "console.log(\\"I am brand new!\\");"
}'

## Second Room
curl "http://localhost:3333/api/rooms/ABCDEFGH"

## Non-existing Room
curl "http://localhost:3333/api/rooms/fakeroom"

## Fake Room & Submission
curl "http://localhost:3333/api/rooms/fakeroom/submission"

## CREATE submission
curl -X "POST" "http://localhost:3333/api/submissions" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "submission": "console.log('"'"'hi this is some new stuff'"'"')",
  "roomId": "11111111"
}'

## GET Submissions
curl "http://localhost:3333/api/submissions"
