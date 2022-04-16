import Axios from 'axios'
import ms from 'ms'
import { getUser } from '../get-user'
import {
  Command,
  CommandDescription,
  FollowingParams,
  FollowingPayload,
} from 'types/api'

export const description: CommandDescription = {
  endpoint: 'following',
  options: 'from_id: number, to_name: string',
  description: 'Used to get how long a user has been following another',
}

export const followage: Command = async (req, res, authFile): Promise<void> => {
  const { from_id, to_name } = req.query as FollowingParams

  const payload: FollowingPayload = {
    followingFor: 0,
    isFollowing: false,
    error: null,
  }

  if (!(from_id && to_name)) {
    res.status(400)
    res.send({
      ...payload,
      error: 'Please specify both "from_id" and "to_name"',
    })
    return
  }

  const to = await getUser(to_name)

  if (to.id === undefined) {
    res.status(404)
    res.send({
      ...payload,
      error: 'Could not find user (to_name option)',
    })
    return
  }

  await Axios.get(`https://api.twitch.tv/helix/users/follows`, {
    headers: {
      'Client-ID': process.env.CHATBOT_ID!,
      Authorization: `Bearer ${authFile?.access_token}`,
    },
    params: {
      from_id: from_id,
      to_id: to?.id,
    },
  })
    .then((response) => {
      if (response?.data?.data[0] === undefined) {
        res.send(payload)
        return
      }
      const followedTimeStamp = new Date(
        response.data.data[0]?.followed_at
      ).getTime()
      const followedTimeDiff = new Date().getTime() - followedTimeStamp

      res.send({
        ...payload,
        isFollowing: true,
        followingFor: ms(followedTimeDiff, { long: true }),
      })
    })
    .catch((error) => {
      res.status(500)
      res.send({ ...payload, error: error })
    })
}
