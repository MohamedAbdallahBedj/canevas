
export function hasNullableValues(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null || obj[key] === undefined || obj[key] === '' || Number.isNaN(obj[key])) {

                return true; // Found a nullable value
            }
        }
    }
    return false; // No nullable values found
}

export function isObjectContained(parentObj, childObj) {
    // Iterate through the properties of the child object
    for (const key in childObj) {
        if (childObj.hasOwnProperty(key)) {
            // Check if the property exists in the parent object
            if (!parentObj.hasOwnProperty(key) || parentObj[key] !== childObj[key]) {
                return false; // If not found or value is different, return false
            }
        }
    }
    return true; // If all properties are found with same values, return true
}

export const formatBoolean = (value, positive = '++++', negative = '----') => {
    return value ? positive : negative
}
export const getWeekStartAndEnd = (date) => {
    // Ensure the input is a Date object
    const inputDate = new Date(date);

    // If the input is invalid, throw an error
    if (isNaN(inputDate)) {
        throw new Error("Invalid Date");
    }

    // Get the day of the week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = inputDate.getDay();

    // Calculate the difference to Saturday (start of the week)
    const daysToSaturday = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);

    // Calculate start of the week (Saturday)
    const startOfWeek = new Date(inputDate);
    startOfWeek.setDate(inputDate.getDate() - daysToSaturday);

    // Calculate end of the week (Friday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
        startOfWeek: startOfWeek.toLocaleDateString().split('T')[0], // Format: YYYY-MM-DD
        endOfWeek: endOfWeek.toLocaleDateString().split('T')[0],     // Format: YYYY-MM-DD
    };
}