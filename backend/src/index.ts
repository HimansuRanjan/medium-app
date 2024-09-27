import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}
const secret = 'mySecretKey'


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECREAT: string
	}
}>()

app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })

    const jwt = await sign({id: user.id}, c.env.JWT_SECREAT);
    return c.json(jwt);

  } catch (error) {
    c.status(403);
    return c.json({error: error});
  }
})

app.post('/api/v1/user/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    })

    if(!user){
      c.status(403);
      return c.json({error: "User Not Found!"})
    }
    const jwt = await sign({id: user.id}, c.env.JWT_SECREAT);
    return c.json(jwt);

  } catch (error) {
    c.status(403);
    return c.json({error: error});
  }
})

app.post('/api/v1/blog', (c) => {
  return c.text('Sign Up Page')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Sign Up Page')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Sign Up Page')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Sign Up Page')
})

export default app
