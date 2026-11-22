export const generatePassword = (length: number = 12) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    // Guarantee at least one of each character type
    const password = [
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
        lowercase.charAt(Math.floor(Math.random() * lowercase.length)),
        numbers.charAt(Math.floor(Math.random() * numbers.length)),
        symbols.charAt(Math.floor(Math.random() * symbols.length)),
    ];

    const all = uppercase + lowercase + numbers + symbols;

    // Fill the rest of the length
    for (let i = password.length; i < length; i++) {
        password.push(all.charAt(Math.floor(Math.random() * all.length)));
    }

    // Shuffle the array to avoid predictable character positions
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
};
