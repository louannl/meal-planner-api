const createMealTag = (transaction, mealId, tag) => transaction.meal_tags.create({
  data: {
    meals: {
      connect: { id: mealId },
    },
    tags: {
      connectOrCreate: {
        create: { name: tag },
        where: { name: tag },
      },
    },
  },
});

const createMealTags = async (transaction, mealId, tags) => {
  await Promise.all(
    tags.map((tag) => createMealTag(transaction, mealId, tag)),
  );
};

export default createMealTags;
