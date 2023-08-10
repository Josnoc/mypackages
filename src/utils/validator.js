//implement functions to validate data
export const requiredInput = (value) => {
    if (!value.toString().trim().length) {
        return "El campo es obligatorio";
    }
    return null;
}

export const isEmail = (value) => {
    if (!value.match(/(.+)@(.+){2,}\.(.+){2,}/)) {
        return "Introduzca un email válido";
    }
    return null;
}
// export const valiDate = (value) => {
//     if (!value.match(/(^[0-9]+$)\/(^[0-9]+$)\/(^[0-9]+$)/)) {
//         return "Introduzca el formato de fecha válido";
//     }
//     return null;
// }
export const onlyLetters = (value) => {
    if (!value.match(/^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/)) {
        return "Solo se permiten letras";
    }
    return null;
}

export const onlyNumbers = (value) => {
    if (!value.match(/^[0-9]+$/)) {
        return "El formato no coincide";
    }
    return null;
}

export const longString = (value) => {
    if (value.length > 20) {
        return "El campo solo permite un máximo de 20 carácteres";
    }
    return null;
}

export const setLongString = (value, min, max) => {
    if (min) {
        if (value.length < min) {
            return `El campo no puede tener menos de ${min} carácteres`;
        }
    }
    if (max) {
        if (value.length > max) {
            return `El campo no puede tener más de ${max} carácteres`;
        }
    }
    return null;
}

export const validPassword = (value) => {
    if (!value.match(/^[a-z0-9_-]{6,18}$/)) {
        return "El formato no coincide";
    }
    return null;
}

export const maxMin = (value, min, max) => {
    if (min && max) {
        // if (value > max || value < min) {
        //     return `El campo debe valer entre ${min} y ${max}`;
        // }
        if (value > max || value < max) {
            return `El campo no puede ser mayor o menor que ${max}`;
        }
    }
    if (max && value > max) {
        return `El campo no puede valer mas que ${max}`;
    }
    if (min && value < min) {
        return `El campo no puede valer menos que ${min}`;
    }
    return null;
}