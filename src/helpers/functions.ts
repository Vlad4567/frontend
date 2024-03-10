import React from 'react';

export const changeObjectStateKey = <K>(
  value: K[keyof K],
  name: keyof K | (keyof K)[],
  setState: React.Dispatch<React.SetStateAction<K>>,
) => {
  const nameArray = Array.isArray(name) ? name : [name];

  setState(current => {
    const state = { ...current };

    nameArray.forEach(key => {
      state[key] = value;
    });

    return state;
  });
};

export const extractFirstNumber = (str: string) => {
  const match = str.match(/\d+/);

  if (match) {
    return parseInt(match[0], 10);
  }

  return 0;
};

export const separateErrorMessage = (errorMessage: string) => {
  return errorMessage.split(':').slice(1).join().trim();
};

export const objectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj) as (keyof Obj)[];
};

export const convertHyphenToSpace = (str: string) => {
  return str
    .split('-')
    .map((word, index) => (index === 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word))
    .join(' ');
};
