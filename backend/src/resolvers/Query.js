const { forwardTo } = require('prisma-binding');
const { checkIfLoggedIn, hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async users(parent, args, ctx, info) {
    // check if user is allowed to query all users
    checkIfLoggedIn(ctx);
    console.log({
      userOnRequest: ctx.request.user
    });
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // empty where object {}
    // info => query fields from front end query 
    return ctx.db.query.users({}, info)
  },
  async order(parent, args, ctx, info) {
    // make sure they are loggedif
    checkIfLoggedIn(ctx);

    const order = await ctx.db.query.order({
      where: { id: args.id },
    }, info);

    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('Not allowed');
    }
    return order;
  },
  async orders(parent, args, ctx, info) {
    checkIfLoggedIn(ctx);

    const { userId } = ctx.request;
    
    return ctx.db.query.orders({
      where: { 
        user: { id: userId },
      }
    }, info);
  }
};

module.exports = Query;
