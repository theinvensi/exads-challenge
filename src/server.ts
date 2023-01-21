import * as http from 'http'

export type RouterType = { [key: string]: (req: http.IncomingMessage, res: http.ServerResponse) => void }

export class HttpServer {
	private _server: http.Server | undefined = undefined
	private _router: RouterType

	constructor(router: RouterType) {
		this._router = router

		this.setupServer()
	}

	private setupServer() {
		this._server = http.createServer((req, res) => {
			if (!req.url) return HttpServer.respondeAs(res, 404, `RESOURCE_NOT_FOUND`)

			const reqUrl = new URL(req.url, `http://127.0.0.1/`)
			const requestedResourcePath = `${req.method} ${reqUrl.pathname}`
			const requestedResource = this._router[requestedResourcePath]
			if (!requestedResource) return HttpServer.respondeAs(res, 404, `RESOURCE_NOT_FOUND`)

			requestedResource(req, res)
		})

		this._server.listen(process.env.PORT || 3000)
	}

	static respondeAs(res: http.ServerResponse, statusCode: number, payload: any) {
		res.writeHead(statusCode)
		res.write(JSON.stringify(payload))
		res.end()
	}
}