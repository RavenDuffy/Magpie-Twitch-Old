export interface FollowingParams {
  from_id: string
  to_name: string
}

export interface FollowingPayload {
  followingFor: number | string
  isFollowing: boolean
  error: object | null
}
