declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: number
      ACCESS_TOKEN_SECRET: string
    }
  }
}

export {}
