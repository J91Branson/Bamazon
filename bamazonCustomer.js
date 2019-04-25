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
var showTableOnly = function (orderCost) {
    connection.query(
        "SELECT * from products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("Your order total is: " + orderCost);
            connection.end();
        })
 };

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all res of the SELECT statement
        console.table(res);
             inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "What is the id of the item you wish to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How much of the item do you wish to buy?"
            }

            ])
            .then(function (answer) {
                
                var productID = answer.id;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].id == productID) {
                        if (res[i].stock_quantity >= answer.units) {
                            var orderCost = answer.units * res[i].price;
                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: res[i].stock_quantity - answer.units
                                    },
                                    {
                                        id: productID
                                    }
                                ],
                                function (err, res) {
                                    console.log(res.affectedRows + " products updated!\n");
                                    showTableOnly(orderCost);
                                }
                            );
                        } else {
                            console.log("insufficient quantity");
                            start();
                        }
                    }
                }
            }
            );
    }
);
}