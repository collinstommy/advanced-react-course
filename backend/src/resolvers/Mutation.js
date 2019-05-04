const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeEmail } = require('../mail');
const { checkIfLoggedIn, hasPermission } = require('../utils');

const setCookie = (userId, ctx) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  ctx.response.cookie('token', token, {
    httpOnly: true, // stop js access
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year 
  });
}

const Mutation = {
  async createItem(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    const item = ctx.db.mutation.createItem({
      data: {
        // create a relationship
        user: {
          connect: {
            id: ctx.request.userId
          }
        },
        ...args
      }
    }, info);
    return item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info);
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find the items
    const item = await ctx.db.query.item({ where }, `{ id title, user { id }}`);
    const { userId, user } = ctx.request;
    const ownsItem = item.user.id === userId;
    const hasPermission = user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

    // check if they own the item
    if (!ownsItem && !hasPermission) {
      throw new Error(`You don't have permission to delete`);
    }
    return ctx.db.mutation.deleteItem({ where }, info);
    // delete it
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash password
    const password = await bcrypt.hash(args.password, 10); // 10 = salt length
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] } //set needed for enum
      }
    }, info);

    setCookie(user.id, ctx);
    // return usr to browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // check for user with email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password')
    }
    setCookie(user.id, ctx);
    return user;
  },
  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'Goodbye' };
  },
  async requestReset(parent, { email }, ctx, info) {
    // check if real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // set token + expiry
    const resetPromise = promisify(randomBytes);
    const resetToken = (await resetPromise(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    const mailResponse = await transport.sendMail({
      from: 'tomascollins@gmail.com',
      to: email,
      subject: 'Your password reset token',
      html: makeEmail(`Your password reset token is here! \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
    });

    return { message: 'Thanks' };
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error('Password does not match');
    }
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 36000000
      }
    });
    if (!user) {
      throw new Error('Token invalid or expired')
    }

    const password = await bcrypt.hash(args.password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    setCookie(user.userId, ctx);
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );

    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions // needed for enum type
        }
      },
      where: {
        id: args.userId
      },
      info // query data for front end
    })
  },
  async addToCart(parent, args, ctx, info) {
    // check if signed in
    checkIfLoggedIn(ctx);
    const { userId } = ctx.request;
    // query the current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // check if that item is already in their cart
    if (existingCartItem) {
      console.log('already in cart');
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      }, info);
    }
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    }, info)
  },
  async removeFromCart(parent, args, ctx, info) {
    console.log(args);
    const cartItem = await ctx.db.query.cartItem({
      where: {
        id: args.id
      },
    }, `{ id, user { id }}`);
    if (!cartItem) throw new Error('No CartItem Found!');
    
    if (cartItem.user.id !== ctx.request.userId){
      throw new Error('Operation not allowed');
    }
    return ctx.db.mutation.deleteCartItem({
      where: { id: args.id },
    }, info);
  },
};

module.exports = Mutation;
