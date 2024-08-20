export function getNextUserId(userIds: number[], currentIndex: number) {
  currentIndex = currentIndex % userIds.length;
  const userId = userIds[currentIndex];
  return userId;
}
