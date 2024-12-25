import { test, describe } from '@jest/globals'
import * as userService from './user'
import { mongoConnectTest } from '../database/mongo'
import { config } from 'dotenv';
import { User } from '../models/userModel';
import { jwtSign } from '../auth/jwt';
import mongoose from 'mongoose';
config();



describe('should test user service', () => {
    beforeAll(async () => {
        await mongoConnectTest();
    })

    const user: User = {
        adress: 'Qe 40 conj E lote 08',
        email: 'riquelmesenna577@gmail.com',
        name: 'Riquelme',
        password: 'senha123',
        token: jwtSign('riquelmesenna577@gmail.com')
    }

    test('should create a new user', async () => {
        const newUser = await userService.signUp(user)

        expect(newUser).not.toBeInstanceOf(Error);
        expect(newUser).toHaveProperty('id');
        expect(newUser.email).toBe(user.email)
    });

    test('should prevent creating a user with the same email', async () => {
        await expect(() =>
            userService.signUp(user)
        ).rejects.toThrow('User existing')
    })

    test('should signin user', async () => {
        const hasUser = await userService.signIn(user.email, user.password)

        expect(hasUser).not.toBeInstanceOf(Error);
        expect(hasUser).toHaveProperty('id');
    });

    test('should not log in the user if he sends wrong email', async () => {
        await expect(
            userService.signIn('riquelmestayler@gmail.com', user.password)
        ).rejects.toThrow('User not existing')
    });

    test('should not log in the user if he sends wrong password', async () => {
        await expect(
            userService.signIn(user.email, 'invalid')
        ).rejects.toThrow('Password is incorrect')
    });

    test('should find user by token', async () => {
        const userToken = await userService.findUserByToken(user.token)

        expect(userToken).toHaveProperty('id')
        expect(userToken.token).toBe(user.token)
    })

    test('should find user by email', async () => {
        const userToken = await userService.findUserByEmail(user.email)

        expect(userToken).toHaveProperty('id')
        expect(userToken.email).toBe(user.email)
    })

    test('should update user', async () => {
        const updatedUser = await userService.updateUser(user.email, { name: 'Riquelme Senna' });

        expect(updatedUser).not.toBeInstanceOf(Error);
        expect(updatedUser.name).toBe('Riquelme Senna')
    })

    test('should not update if email exist', async () => {
        await expect(
            userService.updateUser(user.email, { email: 'riquelmestayler57@gmail.com' })
        ).rejects.toThrow('User existing')

    })

    test('shoul delete user', async () => {
        const deletedUser = await userService.deleteUser(user.email)

        expect(deletedUser).not.toBeInstanceOf(Error);
    });

    afterAll(async () => {
        mongoose.connection.close()
    })

})