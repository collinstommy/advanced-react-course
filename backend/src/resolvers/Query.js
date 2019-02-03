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
  }
};

module.exports = Query;
