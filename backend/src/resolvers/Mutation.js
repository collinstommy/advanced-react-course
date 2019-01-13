const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
  createItem(parent, args, ctx, info) {
    const item = ctx.db.mutation.createItem({
      data: {
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
    const item =  await ctx.db.query.item({ where }, `{ id title}`);
    // check if they own the item
    // delete it
    return ctx.db.mutation.deleteItem({ where }, info);
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

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true, // stop js access
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year 
    });
    // return usr to browser
    return user;
  }
};

module.exports = Mutation;
