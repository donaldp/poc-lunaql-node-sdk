# LunaQL SDK for JavaScript (POC)

## Getting Started

Visit [https://lunaql.com](https://lunaql.com) to get early access.

### Quick Start

Create a `all.lunaql` query file under the `lunaql/users` directory with the following contents:

#### `./lunaql/users/all.lunaql`

```
query({
	from({
		users: {

		};
	});
});
```

In your `index.js` file, require `LunaQL` and `queryLoader` from the `./src` directory:

```js
const { LunaQL, queryLoader } = require('./src')
```

Now, instantiate a new database instance:

```js
const db = new LunaQL('<db-endpoint>', '<db-key>', queryLoader('./lunaql'));
```

Once you have instantiated a database instance, you can now start querying your database using queries located in the `lunaql` folder:

```js
const main = async () => {
    const response = await db.users.all;

    console.log(response);
}

main();
```

#### Example Response

```js
{
    users: [
        {
            first_name: "Donald",
            last_name: "Pakkies",
            email: "donaldpakkies@gmail.com",
            password: "$2b$10$nY26Y1lZVFKcE4UcngGxpuaCrfSyABl/.mVMclxuk.yVG8ug85eUm",
            email_verified_at: null,
            created_at: "2023-02-25T22:02:16.404351Z",
            updated_at: "2023-02-25T22:02:16.404351Z",
            _id: 417183244514172900,
        },
        {
            first_name: "Luna",
            last_name: "Pakkies",
            email: "me@donaldpakkies.com",
            password: "$2b$10$vWfbJbuQxs2V3BXiinhX6u4GZfiDIjyBzO/d0pBDrR6abmIyJ0ZjW",
            email_verified_at: null,
            created_at: "2023-02-25T22:32:54.503564Z",
            updated_at: "2023-02-25T22:32:54.503564Z",
            _id: 417190954114703360,
        },
    ],
}
```

### Working with Variables

If you wish to use variables inside your queries, you may declare them using the `@var` keyword:

#### `./lunaql/users/find.lunaql`

```
query({
	from({
		users(_id: @var id) {

		};
	});
});
```

And in your `index.js` file, you can specify the `id` variable inside an object then pass the object as the first param:

```js
const main = async () => {
    const response = await db.users.find({ id: 417186261531537408 });

    console.log(response);
}

main();
```

### Todo

- Typescript re-write
- Add tests
