# Magpie-Twitch

Contains everything I'll use to moderate my twitch

## Directory Structure

| File Name          | Description                   |
| ------------------ | ----------------------------- |
| [ChatBot](ChatBot) | Basic chat bot functionallity |
| [API](API)         | API to handle twitch requests |

## Docker

This project is designed to be run using docker. While it is possible to run using inline cmds certain things such as env files will not be loaded and the functionallity will break.

### Commands

Runs dev containers

```
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d --build
```

Shut down dev containers

```
docker-compose -f docker-compose.yml -f docker-compose-dev.yml down --rmi all
```
