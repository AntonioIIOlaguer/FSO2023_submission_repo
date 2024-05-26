const { GraphQLError } = require('graphql');
const checkUser = (currentUser) => {
  if (!currentUser) {
    throw new GraphQLError('wrong credentials', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

module.exports = { checkUser };
