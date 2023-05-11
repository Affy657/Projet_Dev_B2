export function differedDate(days = 1) {
    const date = new Date();
    date.setDate(date.getDate() + days);
  
    return date;
}

export function removeDuplicateObject(array, key) {
    const newArray = [];

    for (const obj in array) {
        if (newArray.findIndex((item) => item[key] === obj[key]) > -1) continue;

        newArray.push(obj);
    }

    return newArray;
}