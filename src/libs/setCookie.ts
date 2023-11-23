export const setCookie = (name: string, value: string, days: number): void => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }

    let cookieValue =
        encodeURIComponent(name) +
        '=' +
        encodeURIComponent(value) +
        expires +
        '; path=/';

    // If your site is on HTTPS, add the Secure attribute
    if (window.location.protocol === 'https:') {
        cookieValue += '; Secure';
    }

    // You can adjust SameSite as needed; here's an example with "Lax"
    cookieValue += '; SameSite=Lax';

    document.cookie = cookieValue;
};
