import { Factory } from 'fishery';
import { User } from '../types';
import postFactory from './post';

const userFactory = Factory.define<User>({
  build: ({ associations, sequence }) => {
    return {
      id: `user-${sequence}`,
      created: false,
      name: 'Bob',
      posts: associations.posts || [],
    };
  },
  afterBuild: user => {
    if (!user.posts.length) {
      user.posts = postFactory.buildList(1, {}, { associations: { user } });
    }
  },
  onCreate: user => {
    user.created = true;
    return Promise.resolve(user);
  },
});

export default userFactory;
