# Magpie-Twitch

Contains everything I'll use to moderate my twitch

## Directory Structure

| File Name | Description                   |
| --------- | ----------------------------- |
| ChatBot   | Basic chat bot functionallity |
| Events    | Webhook event handler         |

## Docker Compose Commands

Runs dev containers

```
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d --build
```

Shut down dev containers

```
docker-compose -f docker-compose.yml -f docker-compose-dev.yml down
```
