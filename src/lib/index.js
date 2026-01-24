import Cookies from 'js-cookie';

export const setInForm = (event, state, setState) => {
    const { name, value } = event.target

    setState({
        ...state,
        [name]: value
    })

}

export const inStorage = (key, value, remember = false) => {
    remember ? Cookies.set(key, value, { expires: 15 }) : Cookies.set(key, value);
};

export const fromStorage = key => {
    return Cookies.get(key);
};

export const clearStorage = key => {
    Cookies.remove(key);
};


export const imgUrl = filename => `${process.env.NEXT_PUBLIC_API_URL}/image/${filename}`