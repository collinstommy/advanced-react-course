function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
}

function checkIfLoggedIn (context) {
  if(!context.request.userId) {
    throw new Error('You must be logged in.')
  }
}

module.exports = { hasPermission, checkIfLoggedIn };
