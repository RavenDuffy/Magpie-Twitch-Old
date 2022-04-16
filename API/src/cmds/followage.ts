import Axios from 'axios'
import ms from 'ms'
import { getUser } from '../get-user'
import { Command, FollowingParams, FollowingPayload } from 'types/api'

export const followage: Command = async (req, res, authFile) => {
  const { from_id, to_name } = req.query as FollowingParams
  if (!(from_id && to_name)) return

  const to = await getUser(to_name)
  const payload: FollowingPayload = {
    followingFor: 0,
    isFollowing: false,
    error: null,
  }

  Axios.get(`https://api.twitch.tv/helix/users/follows`, {
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
        res.send({ ...payload })
        return
      }
      const followedTimeStamp = new Date(
        response?.data?.data[0]?.followed_at
      ).getTime()
      const followedTimeDiff = new Date().getTime() - followedTimeStamp

      res.send({
        ...payload,
        isFollowing: true,
        followingFor: ms(followedTimeDiff, { long: true }),
      })
    })
    .catch((error) => res.send({ ...payload, error: error }))
}
