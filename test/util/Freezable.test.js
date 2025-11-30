import Freezable from '../../src/util/Freezable.js';

describe('Freezable', () => {
  /** @type {Freezable} */
  let freezable;

  beforeEach(() => {
    freezable = new Freezable();
  });

  describe('constructor', () => {
    test('creates a Freezable that is not frozen', () => {
      expect(freezable.isFrozen()).toBe(false);
    });
  });

  describe('freeze', () => {
    test('makes the Freezable frozen', () => {
      expect(freezable.isFrozen()).toBe(false);

      freezable.freeze();

      expect(freezable.isFrozen()).toBe(true);
    });

    test('returns the Freezable', () => {
      expect(freezable.freeze()).toBe(freezable);
    });

    test('does nothing if the Freezable is already frozen', () => {
      freezable.freeze();
      expect(freezable.isFrozen()).toBe(true);
      expect(() => {
        freezable.freeze();
      }).not.toThrow();
      expect(freezable.isFrozen()).toBe(true);
    });
  });

  describe('isFrozen', () => {
    test('returns true if the Freezable is frozen', () => {
      expect(freezable.isFrozen()).toBe(false);
      freezable.freeze();
      expect(freezable.isFrozen()).toBe(true);
    });
  });

  describe('throwIfFrozen', () => {
    test('throws an error if the Freezable is frozen', () => {
      expect(() => {
        freezable.throwIfFrozen();
      }).not.toThrow();

      freezable.freeze();

      expect(() => {
        freezable.throwIfFrozen();
      }).toThrow();
    });
  });

  describe('unfreeze', () => {
    test('makes the Freezable unfrozen', () => {
      freezable.freeze();
      expect(freezable.isFrozen()).toBe(true);

      freezable.unfreeze();

      expect(freezable.isFrozen()).toBe(false);
    });

    test('returns the Freezable', () => {
      expect(freezable.unfreeze()).toBe(freezable);
    });

    test('does nothing if the Freezable is already unfrozen', () => {
      expect(freezable.isFrozen()).toBe(false);
      expect(() => {
        freezable.unfreeze();
      }).not.toThrow();
      expect(freezable.isFrozen()).toBe(false);
    });
  });
});
