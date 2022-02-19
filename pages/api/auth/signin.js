import { withIronSessionApiRoute } from 'iron-session/next';
import { GraphQLClient, gql } from 'graphql-request';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const cookie = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
};

const { GRAPHCMS_URL, GRAPHCMS_PERMANENTAUTH_TOKEN, JWT_SECRET } = process.env;
const client = new GraphQLClient(GRAPHCMS_URL, {
  headers: {
    Authorization: `Bearer ${GRAPHCMS_PERMANENTAUTH_TOKEN}`,
  },
});

const getUserByEmailQuery = gql`
    query getUserByEmailQuery($email: String!) {
      nextUser(where: { email: $email }, stage: DRAFT) {
      id
      email
      password
    }
  }
`;
const updateUserMutation = gql`
mutation updateUser($where:NextUserWhereUniqueInput!, $data: NextUserUpdateInput!){
  updateNextUser(data:$data, where:$where){
    token,
    email
  }
}`;

export default withIronSessionApiRoute(
  async function signIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).end();
      return;
    }
    const getUserResponse = await client.request(getUserByEmailQuery, { email });
    const { nextUser } = getUserResponse;
    if (!nextUser) {
      res.status(400).end();
      return;
    }
    const { password: hashedPassword } = nextUser;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      res.status(400).end();
      return;
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: 36005 });
    const updateUserResponse = await client.request(updateUserMutation, { where: { email }, data: { token } });
    const { updateNextUser } = updateUserResponse;
    if (!updateNextUser?.token) {
      res.status(500).end();
      return;
    }
    req.session.user = {
      token: updateNextUser.token
    };
    await req.session.save();
    res.status(200).json({ token: updateNextUser.token });
  },
  cookie
);
