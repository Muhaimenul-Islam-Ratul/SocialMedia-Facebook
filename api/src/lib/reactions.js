export const reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

export function createEmptyReactionCounts() {
  return reactionTypes.reduce((accumulator, reaction) => {
    accumulator[reaction] = 0;
    return accumulator;
  }, {});
}
