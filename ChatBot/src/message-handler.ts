export const messageHandler = (
  target: string,
  context: object,
  msg: string,
  self: boolean
) => {
  if (self) return

  console.log(target, context, msg)
}
