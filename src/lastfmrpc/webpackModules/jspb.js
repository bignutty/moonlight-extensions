/**
 * Creates a jspb
 * @param fields {Array} Protobuf Field (@jspb.field)
 * @returns {*[]}
 */
function jspb(...fields) {
    if (fields.length === 0) return [];

    // 1. Find the highest index to define the array size once
    let maxIndex = 0;
    for (const [index] of fields) {
        if (index > maxIndex) maxIndex = index;
    }

    // 2. Create the array and pre-fill it with null
    const fjspb = new Array(maxIndex).fill(null);

    // 3. Map the provided values into their positions
    for (const [index, value] of fields) {
        fjspb[index - 1] = value;
    }

    return fjspb;
}

/**
 * Creates a jspb field.
 * @param field Field Number
 * @param value Value
 * @returns jspb field
 */
jspb.f = (field, value)=>{
    return [field, value];
}

/**
 * Creates a jspb field.
 * @param pb jspb
 * @param field Field Number
 * @returns jspb field
 */
jspb.g = (pb, field)=>{
    return pb[field-1];
}

/**
 * Creates a jspb field.
 * @param pb jspb
 * @param field Field Number
 * @param value Field Value
 * @returns jspb field
 */
jspb.s = (pb, field, value)=>{
    return pb[field-1] = value;
}


export default jspb;

