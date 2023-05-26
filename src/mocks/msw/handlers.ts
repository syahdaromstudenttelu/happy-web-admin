import { rest } from 'msw';

export const handlers = [
  rest.get('/login', async (req, res, ctx) => {
    const authHeader = req.headers.get('authorization') as string;

    const base64Credentials = authHeader.split(' ')[1];

    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );

    const [username, password] = credentials.split(':');

    const loginFailed = username !== 'foobar' || password !== 'foobarpass';

    if (loginFailed) {
      return res(
        ctx.status(401),
        ctx.json({
          code: 401,
          status: 'failed',
          data: 'unauthorized',
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        status: 'success',
        data: {
          authStatus: true,
          adminUsername: 'foobar',
          adminPassword: 'foobarpass',
        },
      })
    );
  }),
];
