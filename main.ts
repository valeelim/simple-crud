import { createServer, IncomingMessage, ServerResponse } from 'http'
import { CustomError, User } from './utils'
import UserController from './userController'

const hostname = '127.0.0.1'
const port = 3000

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    switch (true) {
        case req.url === '/': {
            if (req.method === 'GET') {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain')
                res.end('Hello World')
                break
            }
        }
        case req.url?.startsWith('/users'): {
            if (req.method === 'GET') {
                if (req.url === '/users') {
                    const userData: string = UserController.getAllUsers()
                    res.setHeader('Content-Type', 'application/json') 
                    res.end(userData)
                }
                else {
                    const ulid: string | undefined = req.url?.split('/')[2]
                    if (ulid === undefined) {
                        res.statusCode = 404
                        res.end('Not Found')
                        break
                    }
                    const userData: string | CustomError = UserController.getUserById(ulid)
                    if (userData instanceof CustomError) {
                        res.statusCode = userData.code
                        res.setHeader('Content-Type', 'application/json') 
                        res.end(JSON.stringify(userData))
                        break
                    }
                    res.setHeader('Content-Type', 'application/json') 
                    res.end(userData)
                }
            }
            else if (req.method === 'POST') {
                /*
                request: {
                    "id": "...",
                    "email": "...",
                    "name": "...",
                    "dateOfBirth": "...",
                }
                */
                let body: string = ''
                req.on('data', (chunk) => {
                    body += chunk
                })
                req.on('end', () => {
                    const user: User = JSON.parse(body)
                    const userData: string = UserController.createUser(user)
                    res.setHeader('Content-Type', 'application/json') 
                    res.end(userData)
                    return
                })
            }
            else if (req.method === 'PUT') {
                /*
                request: {
                    "id": "01HJN794YJXFCQBX2HFSNQQRZZ",
                    "email": "...",
                    "name": "...",
                    "dateOfBirth": "...",
                }
                */
                let body: string = ''
                req.on('data', (chunk) => {
                    body += chunk
                })
                req.on('end', () => {
                    const user: User = JSON.parse(body)
                    const userData: string | CustomError = UserController.updateUser(user)
                    if (userData instanceof CustomError) {
                        res.statusCode = userData.code
                        res.setHeader('Content-Type', 'application/json') 
                        res.end(JSON.stringify(userData))
                        return
                    }
                    res.setHeader('Content-Type', 'application/json') 
                    res.end(userData)
                })
            }
            else if (req.method === 'DELETE') {
                const ulid: string | undefined = req.url?.split('/')[2]
                if (ulid === undefined) {
                    res.statusCode = 404
                    res.end('Not Found')
                    break
                }
                let body: string = ''
                req.on('data', (chunk) => {
                    body += chunk
                })
                req.on('end', () => {
                    const userData: string | CustomError = UserController.deleteUser(ulid)
                    if (userData instanceof CustomError) {
                        res.statusCode = userData.code
                        res.setHeader('Content-Type', 'application/json') 
                        res.end(JSON.stringify(userData))
                        return
                    }
                    res.setHeader('Content-Type', 'application/json') 
                    res.end(userData)
                })
            }
            break
        }
        default: {
            res.statusCode = 404
            res.end('Not Found')
        }
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
