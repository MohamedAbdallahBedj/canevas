
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

