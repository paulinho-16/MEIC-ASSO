import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import authService from '@/services/authentication'
import constants from '@/config/constants'
import { User } from '@/@types/user'

async function testAuth(req: Request, res: Response){
  res.status(200).json({'message': req.body.user_id});
}

async function register(req: Request, res: Response){
  // Get user credentials
  const { username, password } = req.body

  // Check if all inputs were filled
  if(!(username && password)){
    res.status(400).json({'message': 'Username and password are required'})
  }

  // Check if user already exists
  const oldUser = await authService.getUser(username)
  if (oldUser) {
    return res.status(409).json({'message': 'User Already Exist. Please Login'})
  } 

  //Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

  // Create token
  const token = jwt.sign(
    { username: username },
    constants.secret,
    { expiresIn: "30days"}
  )
  
  const user: User = {
    username: username,
    password: encryptedPassword,
    token: token
  }

  const data = await authService.insertUser(user)
  if(data){
    res.status(201).json(user)
  }
  else{
    res.status(500).json({'message': 'Something went wrong. Try again!'})
  }
}

async function login(req: Request, res: Response){
    // Get user credentials
    const { username, password } = req.body

    // Check if all inputs were filled
    if(!(username && password)){
      res.status(400).json({'message': 'Username and password are required'})
    }
  
    // Validate if user exist in our database
    const user = await authService.getUser(username)

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { username: username },
        constants.secret,
        { expiresIn: '30days', }
      );
      user.token = token;
  
      res.status(200).json(user);
    }
    else {
      res.status(400).json({'message': 'Invalid Credentials'})
    }
}

export default {
  register,
  login,
  testAuth
}
