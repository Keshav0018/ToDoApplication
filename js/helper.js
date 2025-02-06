export const generateRandomId = function () {
  const randomId = function (length = 10) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  };

  return randomId();
};

const createslotTime = function (time) {
  if (time === "morning") return 9;
  if (time === "afternoon") return 18;
  if (time === "evening") return 21;
  if (time === "night") return 24;
};

export const checkTime = function (input) {
  const now = new Date();

  const hours = now.getHours();
  const mins = now.getMinutes();

  const time = createslotTime(input);

  if (hours >= time) {
    return true;
  }

  return false;
};
