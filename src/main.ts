import * as http from 'http'

import { ExAdsCypher } from './exadsCypher.js'
import { HttpServer, RouterType } from './server.js'

new class {
  private _routes: RouterType = {
    [`POST /`]: this.encodeEnglishMessages
  }

  private encodeEnglishMessages(req: http.IncomingMessage, res: http.ServerResponse) {
    req.setEncoding(`utf8`)

    let rawMsg = ``

    req.on(`data`, chunk => rawMsg += chunk)

    req.on(`end`, () => {
      if (rawMsg.length === 0) return HttpServer.respondeAs(res, 400, `MISSING_MSG`)

      const cypher = new ExAdsCypher(rawMsg)

      try {
        const encodedMsg = cypher.encode()
        HttpServer.respondeAs(res, 200, encodedMsg)
      } catch (e) {
        if (e instanceof Error) {
          HttpServer.respondeAs(res, 400, e.message)
        } else {
          HttpServer.respondeAs(res, 400, `${e}`)
        }
      }

    })
  }

  constructor() {
    new HttpServer(this._routes)
  }
}