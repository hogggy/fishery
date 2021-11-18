import { Factory } from 'fishery';

describe('sequence', () => {
  it('increments by one on build', () => {
    const factory = Factory.define<{ sequence: number }>({
      build: ({ sequence }) => ({ sequence }),
    });
    expect(factory.build().sequence).toEqual(1);
    expect(factory.build().sequence).toEqual(2);
  });

  it('increments on buildList for each item', () => {
    const factory = Factory.define<{ sequence: number }>({
      build: ({ sequence }) => ({ sequence }),
    });
    expect(factory.buildList(2).map(s => s.sequence)).toEqual([1, 2]);
    expect(factory.build().sequence).toEqual(3);
  });

  describe('when the factory is extended', () => {
    it('shares the sequence with the original factory', () => {
      const userFactory = Factory.define<{ id: number }>({
        build: ({ sequence }) => ({
          id: sequence,
        }),
      });
      const adminFactory = userFactory.params({});
      expect(adminFactory.build().id).toEqual(1);
      expect(userFactory.build().id).toEqual(2);
      expect(adminFactory.build().id).toEqual(3);
    });
  });

  describe('rewindSequence', () => {
    it('sets sequence back to one after build', () => {
      const factory = Factory.define<{ sequence: number }>({
        build: ({ sequence }) => ({ sequence }),
      });
      expect(factory.build().sequence).toEqual(1);
      factory.rewindSequence();
      expect(factory.build().sequence).toEqual(1);
      expect(factory.build().sequence).toEqual(2);
    });

    it('sets sequence back to one after buildList', () => {
      const factory = Factory.define<{ sequence: number }>({
        build: ({ sequence }) => ({ sequence }),
      });
      expect(factory.buildList(2).map(s => s.sequence)).toEqual([1, 2]);
      factory.rewindSequence();
      expect(factory.buildList(2).map(s => s.sequence)).toEqual([1, 2]);
    });
  });
});
