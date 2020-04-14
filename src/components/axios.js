import axios from 'axios';

const copy = axios.create({
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'csrf-token'
});

export default copy;