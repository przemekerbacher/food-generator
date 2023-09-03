export type Configuration = {
  daysCount: number;
  startDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

const defaultConfiguration: Configuration = {
  daysCount: 7,
  startDay: 1,
};

const CONFIGURATION_LOCAL_STORAGE_KEY = "CONFIGURATION_LOCAL_STORAGE_KEY";

export const getConfiguration = (): Configuration => {
  const item = localStorage.getItem(CONFIGURATION_LOCAL_STORAGE_KEY);

  var obj = {};
  if (item) {
    obj = JSON.parse(item);
  }

  return {
    ...defaultConfiguration,
    ...obj,
  };
};
