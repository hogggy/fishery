import { Factory } from 'fishery';

interface Post {
  title: string;
  user: User;
}

interface User {
  name: string;
  posts: Array<Post>;
}

describe('associations', () => {
  it('can create bi-directional has-many/belongs-to associations', () => {
    const postFactory = Factory.define<Post>({
      build: ({ associations }) => {
        return {
          title: 'A Post',
          user:
            associations.user ||
            userFactory.build({}, { transient: { skipPosts: true } }),
        };
      },
    });
    const userFactory = Factory.define<User>({
      build: params => {
        return {
          name: 'Bob',
          posts: [],
        };
      },
      afterBuild: (user, { transientParams }) => {
        const { skipPosts } = transientParams;

        if (!skipPosts) {
          user.posts.push(postFactory.build({}, { associations: { user } }));
        }
      },
    });

    const user = userFactory.build();
    expect(user.name).toEqual('Bob');
    expect(user.posts[0].user).toEqual(user);
  });
});
