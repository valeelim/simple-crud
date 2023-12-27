import { User, CustomError } from './utils'
import { usersData } from './mock_data'

const UserController = {
    getAllUsers: (): string => {
        return JSON.stringify(usersData)
    },

    getUserById: (ulid: string): string | CustomError => {
        const user: User | undefined = usersData.find((user: User) =>  user.id == ulid)
        if (user === undefined) {
            return new CustomError('User not found', 404)
        }
        return JSON.stringify(user)
    },

    createUser: (user: User): string => {
        usersData.push(user)
        return JSON.stringify(user)
    },

    deleteUser: (ulid: string): string | CustomError => {
        const user: User | undefined = usersData.find((user: User) => user.id == ulid)
        if (user === undefined) {
            return new CustomError('User not found', 404)
        }
        usersData.splice(usersData.indexOf(user), 1)
        return JSON.stringify(user)
    },

    updateUser: (req_user: User): string | CustomError => {
        const userIndex: number = usersData.findIndex((user: User) => user.id == req_user.id)
        if (userIndex === -1) {
            return new CustomError('User not found', 404)
        }
        usersData[userIndex] = req_user 
        return JSON.stringify(req_user)
    }
}

export default UserController
