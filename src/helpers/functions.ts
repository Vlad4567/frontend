import React from 'react';
import { SearchWithParams } from '../types/main';

export const getPaginationItems = (
  currentPage: number,
  lastPage: number,
  maxLength: number,
) => {
  const res: Array<number> = [];

  if (lastPage <= maxLength) {
    for (let i = 1; i <= lastPage; i += 1) {
      res.push(i);
    }
  } else {
    const firstPage = 1;
    const confirmedPagesCount = 3;
    const deductedMaxLength = maxLength - confirmedPagesCount;
    const sideLength = deductedMaxLength / 2;

    if (
      currentPage - firstPage < sideLength ||
      lastPage - currentPage < sideLength
    ) {
      for (let j = 1; j <= sideLength + firstPage; j += 1) {
        res.push(j);
      }

      res.push(NaN);

      for (let k = lastPage - sideLength; k <= lastPage; k += 1) {
        res.push(k);
      }
    } else if (
      currentPage - firstPage >= deductedMaxLength &&
      lastPage - currentPage >= deductedMaxLength
    ) {
      const deductedSideLength = sideLength - 1;

      res.push(1);
      res.push(NaN);

      for (
        let l = currentPage - deductedSideLength;
        l <= currentPage + deductedSideLength;
        l += 1
      ) {
        res.push(l);
      }

      res.push(NaN);
      res.push(lastPage);
    } else {
      const isNearFirstPage = currentPage - firstPage < lastPage - currentPage;
      let remainingLength = maxLength;

      if (isNearFirstPage) {
        for (let m = 1; m <= currentPage + 1; m += 1) {
          res.push(m);
          remainingLength -= 1;
        }

        res.push(NaN);
        remainingLength -= 1;

        for (let n = lastPage - (remainingLength - 1); n <= lastPage; n += 1) {
          res.push(n);
        }
      } else {
        for (let o = lastPage; o >= currentPage - 1; o -= 1) {
          res.unshift(o);
          remainingLength -= 1;
        }

        res.unshift(NaN);
        remainingLength -= 1;

        for (let p = remainingLength; p >= 1; p -= 1) {
          res.unshift(p);
        }
      }
    }
  }

  return res.map((pageNum, index) => ({
    pageNum,
    id: Math.random() + index,
  }));
};

export const getSearchWith = (
  params: SearchWithParams,
  search?: string | URLSearchParams,
) => {
  const newParams = new URLSearchParams(search);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach(item => newParams.append(key, item.toString()));
    } else {
      newParams.set(key, value.toString());
    }
  });

  return newParams.toString();
};

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
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(' ');
};

export const convertSpaceToHyphen = (str: string) => {
  return str
    .split(' ')
    .map(word => word.toLowerCase())
    .join('-');
};

type ModifyPhotoNameKeys =
  | 'Gallery'
  | 'Category'
  | 'Main'
  | 'MainMini'
  | 'ReviewCard'
  | 'ServiceCard';

export const modifyPhotoName = (name: string, key: ModifyPhotoNameKeys) => {
  const dotIndex = name.lastIndexOf('.');

  if (dotIndex !== -1) {
    const baseName = name.substring(0, dotIndex);
    const extension = name.substring(dotIndex);

    switch (key) {
      case 'Gallery':
        return `${baseName}G${extension}`;
      case 'Category':
        return `${baseName}C${extension}`;
      case 'Main':
        return `${baseName}M${extension}`;
      case 'MainMini':
        return `${baseName}Mm${extension}`;
      case 'ReviewCard':
        return `${baseName}R${extension}`;
      case 'ServiceCard':
        return `${baseName}S${extension}`;
      default:
        return name;
    }
  }

  return name;
};

export const fixUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `http://${url}`;
};
