import bcrypt from 'bcrypt';

console.log(bcrypt.hashSync('somepassword', 10))
