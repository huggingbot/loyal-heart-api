import express from 'express'

import { asyncHandler } from '@/utils/common'
import { supabase } from '@/utils/supabase'

const authMiddlewareRouter = express.Router()

authMiddlewareRouter.use(
  asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] // Expecting Bearer token

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { data, error } = await supabase.auth.getUser(token)

      if (error || !data.user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      next()
    } catch (error) {
      console.error('Error verifying JWT:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }),
)

export default authMiddlewareRouter
