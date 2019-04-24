var mysql = require("mysql");
var inquirer = require("inquirer");
// var table = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        inquirer
            .prompt([{
                name: "itemID",
                type: "input",
                message: "What is the id of the item you wish to buy?",
            },
            {
                name: "itemQuanity",
                type: "input",
                message: "How much of the item do you wish to buy?",
            }

            ])
            .then(function (answer) {
console.log(answer);
            });
    });
}