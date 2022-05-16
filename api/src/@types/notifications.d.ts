export type Topic = {
  nome: string
  identification_token: string
}

export type Notifications = {
  title: string
  content: string
  topic: Topic
  userID: string
}
